"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  verifyTeamPassword,
  getTeamBySlug,
  createSignupList,
  updateSignupList,
  updateTeam,
  deleteSignupList,
} from "@/lib/data";
import type { FieldDefinition, SignupListCategory } from "@/lib/types";

// --- Auth ---

export async function loginAction(
  teamSlug: string,
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const password = formData.get("password") as string;

  if (!verifyTeamPassword(teamSlug, password)) {
    return { error: "Incorrect password. Please try again." };
  }

  const cookieStore = await cookies();
  cookieStore.set(`admin_session_${teamSlug}`, "authenticated", {
    httpOnly: true,
    path: `/t/${teamSlug}`,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "lax",
  });

  redirect(`/t/${teamSlug}/admin`);
}

// --- List CRUD ---

export async function createListAction(
  teamSlug: string,
  formData: FormData
): Promise<{ error: string } | null> {
  const team = getTeamBySlug(teamSlug);
  if (!team) return { error: "Team not found" };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required" };

  const category = formData.get("category") as SignupListCategory;
  const slotsNeeded = parseInt(formData.get("slotsNeeded") as string, 10);
  if (!slotsNeeded || slotsNeeded < 1)
    return { error: "Slots needed must be at least 1" };

  // Parse custom field definitions from JSON
  const fieldsJson = formData.get("fields") as string;
  let fields: FieldDefinition[] = [];
  try {
    fields = JSON.parse(fieldsJson);
  } catch {
    return { error: "Invalid field definitions" };
  }

  createSignupList(team.id, {
    name,
    category,
    date: (formData.get("date") as string) || undefined,
    time: (formData.get("time") as string) || undefined,
    location: (formData.get("location") as string) || undefined,
    note: (formData.get("note") as string) || undefined,
    slotsNeeded,
    fields,
  });

  revalidatePath(`/t/${teamSlug}/admin`);
  redirect(`/t/${teamSlug}/admin`);
}

export async function updateListAction(
  teamSlug: string,
  listId: string,
  formData: FormData
): Promise<{ error: string } | null> {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required" };

  const category = formData.get("category") as SignupListCategory;
  const slotsNeeded = parseInt(formData.get("slotsNeeded") as string, 10);
  if (!slotsNeeded || slotsNeeded < 1)
    return { error: "Slots needed must be at least 1" };

  const fieldsJson = formData.get("fields") as string;
  let fields: FieldDefinition[] = [];
  try {
    fields = JSON.parse(fieldsJson);
  } catch {
    return { error: "Invalid field definitions" };
  }

  updateSignupList(listId, {
    name,
    category,
    date: (formData.get("date") as string) || undefined,
    time: (formData.get("time") as string) || undefined,
    location: (formData.get("location") as string) || undefined,
    note: (formData.get("note") as string) || undefined,
    slotsNeeded,
    fields,
  });

  revalidatePath(`/t/${teamSlug}/admin`);
  redirect(`/t/${teamSlug}/admin`);
}

export async function deleteListAction(
  teamSlug: string,
  listId: string
): Promise<void> {
  deleteSignupList(listId);
  revalidatePath(`/t/${teamSlug}/admin`);
  redirect(`/t/${teamSlug}/admin`);
}

// --- Team settings ---

export async function updateTeamAction(
  teamSlug: string,
  formData: FormData
): Promise<{ error: string } | null> {
  const team = getTeamBySlug(teamSlug);
  if (!team) return { error: "Team not found" };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Team name is required" };

  const seasonYear = parseInt(formData.get("seasonYear") as string, 10);
  if (!seasonYear) return { error: "Season year is required" };

  const adminPassword = (formData.get("adminPassword") as string)?.trim();
  if (!adminPassword) return { error: "Admin password is required" };

  const coachLastName = (formData.get("coachLastName") as string)?.trim();

  updateTeam(team.id, {
    name,
    seasonYear,
    adminPassword,
    ...(coachLastName ? { coachLastName } : {}),
  });

  // If password changed, update the cookie
  const cookieStore = await cookies();
  cookieStore.set(`admin_session_${teamSlug}`, "authenticated", {
    httpOnly: true,
    path: `/t/${teamSlug}`,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  revalidatePath(`/t/${teamSlug}/admin`);
  redirect(`/t/${teamSlug}/admin`);
}
