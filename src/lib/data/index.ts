// Swappable data layer.
// Currently backed by mock data. To switch to a real backend,
// replace the implementations in this file without changing the signatures.

import type {
  Team,
  SignupList,
  SignupEntry,
  FieldDefinition,
  ListStatus,
  UrgencyLevel,
} from "@/lib/types";
import { teams, signupLists } from "./mock-data";

export function searchTeamsByCoach(lastName: string): Team[] {
  const query = lastName.toLowerCase().trim();
  if (!query) return [];
  return teams.filter((t) =>
    t.coachLastName.toLowerCase().includes(query)
  );
}

export function getTeamBySlug(slug: string): Team | undefined {
  return teams.find((t) => t.slug === slug);
}

export function getSignupListsForTeam(teamId: string): SignupList[] {
  return signupLists.filter((l) => l.teamId === teamId);
}

export function getSignupListBySlug(
  teamId: string,
  listSlug: string
): SignupList | undefined {
  return signupLists.find(
    (l) => l.teamId === teamId && l.slug === listSlug
  );
}

export function getListStatus(list: SignupList): ListStatus {
  const filledCount = list.entries.filter((e) => {
    const requiredFields = list.fields.filter((f) => f.required);
    return requiredFields.every((f) => {
      const val = e.values[f.key];
      return val && val.trim() !== "";
    });
  }).length;

  const total = list.slotsNeeded;
  const filled = Math.min(filledCount, total);

  if (filled >= total) {
    return { level: "complete", filled, total };
  }

  const level = computeUrgencyLevel(list);
  return { level, filled, total };
}

function computeUrgencyLevel(list: SignupList): UrgencyLevel {
  if (list.category === "standalone") {
    return "info";
  }

  if (!list.date) return "info";

  const eventDate = new Date(list.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffMs = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) return "urgent";
  if (diffDays <= 14) return "high";
  if (diffDays <= 21) return "warning";
  return "info";
}

// Group dated sign-up lists by their date
export type DateGroup = {
  date: string;
  lists: SignupList[];
};

export function groupListsByDate(lists: SignupList[]): DateGroup[] {
  const datedLists = lists.filter((l) => l.category === "dated" && l.date);
  const groups = new Map<string, DateGroup>();

  for (const list of datedLists) {
    const key = list.date!;
    if (!groups.has(key)) {
      groups.set(key, { date: key, lists: [] });
    }
    groups.get(key)!.lists.push(list);
  }

  // Sort by date ascending
  return Array.from(groups.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getStandaloneLists(lists: SignupList[]): SignupList[] {
  return lists.filter((l) => l.category === "standalone");
}

// --- Slugify helper ---

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ensureUniqueSlug(base: string, teamId: string): string {
  const existing = signupLists
    .filter((l) => l.teamId === teamId)
    .map((l) => l.slug);
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

// --- Auth ---

export function verifyTeamPassword(
  teamSlug: string,
  password: string
): boolean {
  const team = teams.find((t) => t.slug === teamSlug);
  if (!team) return false;
  return team.adminPassword === password;
}

// --- List mutations ---

export function createSignupList(
  teamId: string,
  data: {
    name: string;
    category: SignupList["category"];
    date?: string;
    time?: string;
    location?: string;
    note?: string;
    slotsNeeded: number;
    fields: FieldDefinition[];
  }
): SignupList {
  const baseSlug = slugify(data.name);
  const slug = data.date
    ? ensureUniqueSlug(`${baseSlug}-${data.date}`, teamId)
    : ensureUniqueSlug(baseSlug, teamId);

  const list: SignupList = {
    id: crypto.randomUUID(),
    teamId,
    name: data.name,
    slug,
    category: data.category,
    date: data.date,
    time: data.time,
    location: data.location,
    note: data.note,
    fields: data.fields,
    slotsNeeded: data.slotsNeeded,
    entries: [],
  };

  signupLists.push(list);
  return list;
}

export function updateSignupList(
  listId: string,
  data: Partial<
    Omit<SignupList, "id" | "teamId" | "slug" | "entries">
  >
): SignupList | undefined {
  const list = signupLists.find((l) => l.id === listId);
  if (!list) return undefined;
  Object.assign(list, data);
  return list;
}

export function deleteSignupList(listId: string): void {
  const idx = signupLists.findIndex((l) => l.id === listId);
  if (idx !== -1) signupLists.splice(idx, 1);
}

// --- Team mutations ---

export function updateTeam(
  teamId: string,
  data: Partial<Omit<Team, "id" | "slug">>
): Team | undefined {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return undefined;
  Object.assign(team, data);
  return team;
}

// --- Entry mutations ---

export function updateSignupEntry(
  listId: string,
  entryId: string,
  data: Record<string, string>
): SignupEntry | undefined {
  const list = signupLists.find((l) => l.id === listId);
  if (!list) return undefined;
  const entry = list.entries.find((e) => e.id === entryId);
  if (!entry) return undefined;
  entry.values = { ...entry.values, ...data };
  return entry;
}

export function deleteSignupEntry(listId: string, entryId: string): void {
  const list = signupLists.find((l) => l.id === listId);
  if (!list) return;
  const idx = list.entries.findIndex((e) => e.id === entryId);
  if (idx !== -1) list.entries.splice(idx, 1);
}
