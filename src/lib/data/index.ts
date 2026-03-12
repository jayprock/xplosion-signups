// Swappable data layer.
// Currently backed by mock data. To switch to a real backend,
// replace the implementations in this file without changing the signatures.

import type {
  Team,
  SignupList,
  SignupEntry,
  FieldDefinition,
  SignupListCategory,
  ListStatus,
  UrgencyLevel,
} from "@/lib/types";
import { teams, signupLists } from "./mock-data";
import { slugify } from "@/lib/utils";

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

// --- Mutation types ---

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

export type UpdateListInput = {
  name?: string;
  category?: SignupListCategory;
  date?: string;
  time?: string;
  location?: string;
  note?: string;
  slotsNeeded?: number;
  fields?: FieldDefinition[];
};

export type UpdateTeamInput = {
  name?: string;
  seasonYear?: number;
  adminPassword?: string;
};

// --- Mutations ---

export function createSignupList(
  teamId: string,
  data: CreateListInput
): SignupList {
  const baseSlug = slugify(data.name);
  const dateSuffix = data.date ? `-${data.date}` : "";
  let slug = baseSlug + dateSuffix;

  // Ensure slug uniqueness within the team
  const existing = signupLists.filter(
    (l) => l.teamId === teamId && l.slug === slug
  );
  if (existing.length > 0) {
    slug = `${slug}-${Date.now()}`;
  }

  const newList: SignupList = {
    id: `list-${Date.now()}`,
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

  signupLists.push(newList);
  return newList;
}

export function updateSignupList(
  listId: string,
  data: UpdateListInput
): SignupList | undefined {
  const list = signupLists.find((l) => l.id === listId);
  if (!list) return undefined;

  if (data.name !== undefined) list.name = data.name;
  if (data.category !== undefined) list.category = data.category;
  if (data.date !== undefined) list.date = data.date;
  if (data.time !== undefined) list.time = data.time;
  if (data.location !== undefined) list.location = data.location;
  if (data.note !== undefined) list.note = data.note;
  if (data.slotsNeeded !== undefined) list.slotsNeeded = data.slotsNeeded;
  if (data.fields !== undefined) list.fields = data.fields;

  return list;
}

export function deleteSignupList(listId: string): boolean {
  const idx = signupLists.findIndex((l) => l.id === listId);
  if (idx === -1) return false;
  signupLists.splice(idx, 1);
  return true;
}

export function updateTeam(
  teamId: string,
  data: UpdateTeamInput
): Team | undefined {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return undefined;

  if (data.name !== undefined) team.name = data.name;
  if (data.seasonYear !== undefined) team.seasonYear = data.seasonYear;
  if (data.adminPassword !== undefined) team.adminPassword = data.adminPassword;

  return team;
}

export function updateSignupEntry(
  listId: string,
  entryId: string,
  values: Record<string, string>
): SignupEntry | undefined {
  const list = signupLists.find((l) => l.id === listId);
  if (!list) return undefined;

  const entry = list.entries.find((e) => e.id === entryId);
  if (!entry) return undefined;

  entry.values = { ...entry.values, ...values };
  return entry;
}

export function deleteSignupEntry(
  listId: string,
  entryId: string
): boolean {
  const list = signupLists.find((l) => l.id === listId);
  if (!list) return false;

  const idx = list.entries.findIndex((e) => e.id === entryId);
  if (idx === -1) return false;
  list.entries.splice(idx, 1);
  return true;
}
