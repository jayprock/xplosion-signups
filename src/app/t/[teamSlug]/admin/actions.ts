"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { FieldDefinition, SignupListCategory } from "@/lib/types";
import {
  verifyAdminPassword,
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
  const valid = verifyAdminPassword(teamSlug, password);
  if (!valid) {
    return { success: false, error: "Incorrect password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(`admin_${teamSlug}`, teamSlug, {
    httpOnly: true,
    path: `/t/${teamSlug}`,
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "lax",
  });

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
};

export async function createListAction(teamSlug: string, data: CreateListInput) {
  const team = getTeamBySlug(teamSlug);
  if (!team) throw new Error("Team not found");

  createSignupList(team.id, data);
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
  updateSignupList(listId, data);
  revalidatePath(`/t/${teamSlug}`);
  redirect(`/t/${teamSlug}/admin`);
}

export async function deleteListAction(teamSlug: string, listId: string) {
  deleteSignupList(listId);
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
  const team = getTeamBySlug(teamSlug);
  if (!team) throw new Error("Team not found");

  updateTeam(team.id, data);
  revalidatePath(`/t/${teamSlug}`);
  redirect(`/t/${teamSlug}/admin/settings`);
}
