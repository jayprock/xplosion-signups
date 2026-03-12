// Swappable data layer.
// Currently backed by mock data. To switch to a real backend,
// replace the implementations in this file without changing the signatures.

import type {
  Team,
  SignupList,
  SignupEntry,
  SignupListCategory,
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

// --- Auth ---

export function verifyAdminPassword(
  teamSlug: string,
  password: string
): boolean {
  const team = getTeamBySlug(teamSlug);
  if (!team) return false;
  return team.adminPassword === password;
}

// --- Slug generation ---

function generateSlug(name: string, date?: string): string {
  let base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (date) base += `-${date}`;

  let slug = base;
  let counter = 2;
  while (signupLists.some((l) => l.slug === slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

// --- List mutations ---

export function createSignupList(
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
): SignupList {
  const slug = generateSlug(
    data.name,
    data.category === "dated" ? data.date : undefined
  );
  const newList: SignupList = {
    id: `list-${Date.now()}`,
    teamId,
    slug,
    name: data.name,
    category: data.category,
    date: data.date,
    time: data.time,
    location: data.location,
    note: data.note,
    slotsNeeded: data.slotsNeeded,
    fields: data.fields,
    entries: [],
  };
  signupLists.push(newList);
  return newList;
}

export function updateSignupList(
  listId: string,
  data: Partial<Omit<SignupList, "id" | "slug" | "teamId">>
): SignupList {
  const index = signupLists.findIndex((l) => l.id === listId);
  if (index === -1) throw new Error(`List ${listId} not found`);
  signupLists[index] = { ...signupLists[index], ...data };
  return signupLists[index];
}

export function deleteSignupList(listId: string): void {
  const index = signupLists.findIndex((l) => l.id === listId);
  if (index !== -1) signupLists.splice(index, 1);
}

// --- Team mutations ---

export function updateTeam(
  teamId: string,
  data: Partial<Omit<Team, "id" | "slug">>
): Team {
  const index = teams.findIndex((t) => t.id === teamId);
  if (index === -1) throw new Error(`Team ${teamId} not found`);
  teams[index] = { ...teams[index], ...data };
  return teams[index];
}

// --- Entry mutations ---

export function updateSignupEntry(
  listId: string,
  entryId: string,
  data: Record<string, string>
): SignupEntry {
  const list = signupLists.find((l) => l.id === listId);
  if (!list) throw new Error(`List ${listId} not found`);
  const entry = list.entries.find((e) => e.id === entryId);
  if (!entry) throw new Error(`Entry ${entryId} not found`);
  entry.values = { ...entry.values, ...data };
  return entry;
}

export function deleteSignupEntry(listId: string, entryId: string): void {
  const list = signupLists.find((l) => l.id === listId);
  if (!list) return;
  list.entries = list.entries.filter((e) => e.id !== entryId);
}
