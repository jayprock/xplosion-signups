"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { FieldDefinition, SignupListCategory } from "@/lib/types";
import {
  verifyAdminPassword,
  verifySiteAdminPassword,
  getTeamBySlug,
  createSignupList,
  updateSignupList,
  deleteSignupList,
  updateTeam,
} from "@/lib/data";

export async function loginAction(
  teamSlug: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const valid = await verifyAdminPassword(teamSlug, password);
  if (!valid) {
    return { success: false, error: "Incorrect password" };
  }

  const cookieStore = await cookies();

  // If they used the site admin password, set the site-wide cookie
  if (verifySiteAdminPassword(password)) {
    cookieStore.set("site_admin", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    });
  } else {
    cookieStore.set(`admin_${teamSlug}`, teamSlug, {
      httpOnly: true,
      path: `/t/${teamSlug}`,
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    });
  }

  return { success: true };
}

export type CreateListInput = {
  name: string;
  category: SignupListCategory;
  date?: string;
  time?: string;
  location?: string;
  note?: string;
  slotsNeeded: number;
  fields: FieldDefinition[];
  recurring?: {
    untilDate: string; // ISO date
  };
};

function getWeeklyDates(startDate: string, untilDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate + "T12:00:00");
  const end = new Date(untilDate + "T12:00:00");

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 7);
  }
  return dates;
}

export async function createListAction(teamSlug: string, data: CreateListInput) {
  const team = await getTeamBySlug(teamSlug);
  if (!team) throw new Error("Team not found");

  const { recurring, ...listData } = data;

  if (recurring && data.category === "dated" && data.date) {
    const dates = getWeeklyDates(data.date, recurring.untilDate);
    for (const d of dates) {
      await createSignupList(team.id, { ...listData, date: d });
    }
  } else {
    await createSignupList(team.id, listData);
  }

  revalidatePath(`/t/${teamSlug}`);
  redirect(`/t/${teamSlug}/admin`);
}

export type UpdateListInput = {
  name: string;
  category: SignupListCategory;
  date?: string;
  time?: string;
  location?: string;
  note?: string;
  slotsNeeded: number;
  fields: FieldDefinition[];
};

export async function updateListAction(
  teamSlug: string,
  listId: string,
  data: UpdateListInput
) {
  await updateSignupList(listId, data);
  revalidatePath(`/t/${teamSlug}`);
  redirect(`/t/${teamSlug}/admin`);
}

export async function deleteListAction(teamSlug: string, listId: string) {
  await deleteSignupList(listId);
  revalidatePath(`/t/${teamSlug}`);
}

export type UpdateTeamInput = {
  name: string;
  seasonYear: number;
  adminPassword: string;
};

export async function updateTeamAction(
  teamSlug: string,
  data: UpdateTeamInput
) {
  const team = await getTeamBySlug(teamSlug);
  if (!team) throw new Error("Team not found");

  await updateTeam(team.id, data);
  revalidatePath(`/t/${teamSlug}`);
  redirect(`/t/${teamSlug}/admin/settings`);
}
