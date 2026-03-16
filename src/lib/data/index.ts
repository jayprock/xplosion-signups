// Data layer backed by Supabase.
// All functions are async — callers must await.
// Pure helpers (getListStatus, groupListsByDate, etc.) are in ./helpers.ts

import type {
  Team,
  SignupList,
  SignupEntry,
  SignupListCategory,
  FieldDefinition,
} from "@/lib/types";
import { supabase } from "@/lib/supabase";

// Re-export helpers so existing imports from "@/lib/data" keep working
export { getListStatus, groupListsByDate, getStandaloneLists } from "./helpers";
export type { DateGroup } from "./helpers";

// --- Column mapping helpers ---

function toTeam(row: Record<string, unknown>): Team {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    coachLastName: row.coach_last_name as string,
    seasonYear: row.season_year as number,
    adminPassword: row.admin_password as string,
  };
}

function toEntry(row: Record<string, unknown>): SignupEntry {
  return {
    id: row.id as string,
    slotIndex: row.slot_index as number,
    values: row.values as Record<string, string>,
    signedUpAt: row.signed_up_at as string,
  };
}

function toSignupList(
  row: Record<string, unknown>,
  entries: SignupEntry[]
): SignupList {
  return {
    id: row.id as string,
    teamId: row.team_id as string,
    name: row.name as string,
    slug: row.slug as string,
    category: row.category as SignupListCategory,
    date: (row.date as string) ?? undefined,
    time: (row.time as string) ?? undefined,
    location: (row.location as string) ?? undefined,
    note: (row.note as string) ?? undefined,
    fields: row.fields as FieldDefinition[],
    slotsNeeded: row.slots_needed as number,
    entries,
  };
}

// --- Queries ---

export async function searchTeamsByCoach(lastName: string): Promise<Team[]> {
  const query = lastName.toLowerCase().trim();
  if (!query) return [];
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .ilike("coach_last_name", `%${query}%`);
  if (error) throw error;
  return (data ?? []).map(toTeam);
}

export async function getTeamBySlug(
  slug: string
): Promise<Team | undefined> {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? toTeam(data) : undefined;
}

export async function getSignupListsForTeam(
  teamId: string
): Promise<SignupList[]> {
  const { data: rows, error } = await supabase
    .from("signup_lists")
    .select("*, signup_entries(*)")
    .eq("team_id", teamId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (rows ?? []).map((row) => {
    const entries = ((row.signup_entries as Record<string, unknown>[]) ?? [])
      .map(toEntry)
      .sort((a, b) => a.slotIndex - b.slotIndex);
    return toSignupList(row, entries);
  });
}

export async function getSignupListBySlug(
  teamId: string,
  listSlug: string
): Promise<SignupList | undefined> {
  const { data: row, error } = await supabase
    .from("signup_lists")
    .select("*, signup_entries(*)")
    .eq("team_id", teamId)
    .eq("slug", listSlug)
    .maybeSingle();
  if (error) throw error;
  if (!row) return undefined;
  const entries = ((row.signup_entries as Record<string, unknown>[]) ?? [])
    .map(toEntry)
    .sort((a, b) => a.slotIndex - b.slotIndex);
  return toSignupList(row, entries);
}

// --- Auth ---

const SITE_ADMIN_PASSWORD =
  process.env.SITE_ADMIN_PASSWORD ?? "admin123";

export function verifySiteAdminPassword(password: string): boolean {
  return password === SITE_ADMIN_PASSWORD;
}

export async function verifyAdminPassword(
  teamSlug: string,
  password: string
): Promise<boolean> {
  if (password === SITE_ADMIN_PASSWORD) return true;
  const team = await getTeamBySlug(teamSlug);
  if (!team) return false;
  return team.adminPassword === password;
}

// --- Slug generation ---

async function generateSlug(
  teamId: string,
  name: string,
  date?: string
): Promise<string> {
  let base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (date) base += `-${date}`;

  // Check for existing slugs with this base in the team
  const { data } = await supabase
    .from("signup_lists")
    .select("slug")
    .eq("team_id", teamId)
    .like("slug", `${base}%`);

  const existing = new Set((data ?? []).map((r) => r.slug));
  let slug = base;
  let counter = 2;
  while (existing.has(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

export async function generateTeamSlug(name: string): Promise<string> {
  let base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const { data } = await supabase
    .from("teams")
    .select("slug")
    .like("slug", `${base}%`);

  const existing = new Set((data ?? []).map((r) => r.slug));
  let slug = base;
  let counter = 2;
  while (existing.has(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

// --- Team mutations ---

export async function createTeam(data: {
  name: string;
  slug: string;
  coachLastName: string;
  seasonYear: number;
  adminPassword: string;
}): Promise<Team> {
  const { data: row, error } = await supabase
    .from("teams")
    .insert({
      name: data.name,
      slug: data.slug,
      coach_last_name: data.coachLastName,
      season_year: data.seasonYear,
      admin_password: data.adminPassword,
    })
    .select()
    .single();
  if (error) throw error;
  return toTeam(row);
}

export async function updateTeam(
  teamId: string,
  data: Partial<Omit<Team, "id" | "slug">>
): Promise<Team> {
  const update: Record<string, unknown> = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.coachLastName !== undefined)
    update.coach_last_name = data.coachLastName;
  if (data.seasonYear !== undefined) update.season_year = data.seasonYear;
  if (data.adminPassword !== undefined)
    update.admin_password = data.adminPassword;

  const { data: row, error } = await supabase
    .from("teams")
    .update(update)
    .eq("id", teamId)
    .select()
    .single();
  if (error) throw error;
  return toTeam(row);
}

// --- List mutations ---

export async function createSignupList(
  teamId: string,
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
): Promise<SignupList> {
  const slug = await generateSlug(
    teamId,
    data.name,
    data.category === "dated" ? data.date : undefined
  );

  const { data: row, error } = await supabase
    .from("signup_lists")
    .insert({
      team_id: teamId,
      slug,
      name: data.name,
      category: data.category,
      date: data.date ?? null,
      time: data.time ?? null,
      location: data.location ?? null,
      note: data.note ?? null,
      slots_needed: data.slotsNeeded,
      fields: data.fields,
    })
    .select()
    .single();
  if (error) throw error;
  return toSignupList(row, []);
}

export async function updateSignupList(
  listId: string,
  data: Partial<Omit<SignupList, "id" | "slug" | "teamId">>
): Promise<SignupList> {
  const update: Record<string, unknown> = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.category !== undefined) update.category = data.category;
  if (data.date !== undefined) update.date = data.date;
  if (data.time !== undefined) update.time = data.time;
  if (data.location !== undefined) update.location = data.location;
  if (data.note !== undefined) update.note = data.note;
  if (data.slotsNeeded !== undefined) update.slots_needed = data.slotsNeeded;
  if (data.fields !== undefined) update.fields = data.fields;

  const { data: row, error } = await supabase
    .from("signup_lists")
    .update(update)
    .eq("id", listId)
    .select("*, signup_entries(*)")
    .single();
  if (error) throw error;
  const entries = ((row.signup_entries as Record<string, unknown>[]) ?? [])
    .map(toEntry)
    .sort((a, b) => a.slotIndex - b.slotIndex);
  return toSignupList(row, entries);
}

export async function deleteSignupList(listId: string): Promise<void> {
  const { error } = await supabase
    .from("signup_lists")
    .delete()
    .eq("id", listId);
  if (error) throw error;
}

// --- Entry mutations ---

export async function claimSignupSlot(
  listId: string,
  slotIndex: number,
  values: Record<string, string>
): Promise<{ entry?: SignupEntry; error?: string }> {
  const { data, error } = await supabase.rpc("claim_signup_slot", {
    p_list_id: listId,
    p_slot_index: slotIndex,
    p_values: values,
  });
  if (error) throw error;
  const result = data as { entry?: Record<string, unknown>; error?: string };
  if (result.error) return { error: result.error };
  return {
    entry: {
      id: result.entry!.id as string,
      slotIndex: result.entry!.slotIndex as number,
      values: result.entry!.values as Record<string, string>,
      signedUpAt: result.entry!.signedUpAt as string,
    },
  };
}

export async function updateSignupEntry(
  listId: string,
  entryId: string,
  data: Record<string, string>
): Promise<SignupEntry> {
  // Merge with existing values
  const { data: existing, error: fetchError } = await supabase
    .from("signup_entries")
    .select("*")
    .eq("id", entryId)
    .eq("list_id", listId)
    .single();
  if (fetchError) throw fetchError;

  const merged = { ...(existing.values as Record<string, string>), ...data };

  const { data: row, error } = await supabase
    .from("signup_entries")
    .update({ values: merged })
    .eq("id", entryId)
    .select()
    .single();
  if (error) throw error;
  return toEntry(row);
}

export async function deleteSignupEntry(
  listId: string,
  entryId: string
): Promise<void> {
  const { error } = await supabase
    .from("signup_entries")
    .delete()
    .eq("id", entryId)
    .eq("list_id", listId);
  if (error) throw error;
}
