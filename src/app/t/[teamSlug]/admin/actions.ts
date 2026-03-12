"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  verifyAdminPassword,
  getTeamBySlug,
  createSignupList,
  updateSignupList,
  deleteSignupList,
  updateTeam,
  updateSignupEntry,
  deleteSignupEntry,
} from "@/lib/data";
import type { FieldDefinition, SignupListCategory } from "@/lib/types";

export async function loginAction(teamSlug: string, password: string) {
  const valid = verifyAdminPassword(teamSlug, password);
  if (!valid) {
    return { error: "Invalid password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(`admin_${teamSlug}`, "authenticated", {
    httpOnly: true,
    path: `/t/${teamSlug}`,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect(`/t/${teamSlug}/admin`);
}

export async function createListAction(
  teamSlug: string,
  data: {
    name: string;
    category: SignupListCategory;
    date?: string;
    time?: string;
    location?: string;
    note?: string;
    slotsNeeded: number;
    fields: FieldDefinition[];
  }
) {
  const team = getTeamBySlug(teamSlug);
  if (!team) return { error: "Team not found" };

  createSignupList(team.id, data);
  revalidatePath(`/t/${teamSlug}`);
  redirect(`/t/${teamSlug}/admin`);
}

export async function updateListAction(
  teamSlug: string,
  listId: string,
  data: {
    name?: string;
    category?: SignupListCategory;
    date?: string;
    time?: string;
    location?: string;
    note?: string;
    slotsNeeded?: number;
    fields?: FieldDefinition[];
  }
) {
  updateSignupList(listId, data);
  revalidatePath(`/t/${teamSlug}`);
  redirect(`/t/${teamSlug}/admin`);
}

export async function deleteListAction(teamSlug: string, listId: string) {
  deleteSignupList(listId);
  revalidatePath(`/t/${teamSlug}`);
  redirect(`/t/${teamSlug}/admin`);
}

export async function updateTeamAction(
  teamSlug: string,
  data: {
    name?: string;
    seasonYear?: number;
    adminPassword?: string;
  }
) {
  const team = getTeamBySlug(teamSlug);
  if (!team) return { error: "Team not found" };

  updateTeam(team.id, data);
  revalidatePath(`/t/${teamSlug}`);
  redirect(`/t/${teamSlug}/admin`);
}

export async function updateEntryAction(
  teamSlug: string,
  listId: string,
  entryId: string,
  values: Record<string, string>
) {
  updateSignupEntry(listId, entryId, values);
  revalidatePath(`/t/${teamSlug}`);
}

export async function deleteEntryAction(
  teamSlug: string,
  listId: string,
  entryId: string
) {
  deleteSignupEntry(listId, entryId);
  revalidatePath(`/t/${teamSlug}`);
}
