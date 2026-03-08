// Swappable data layer.
// Currently backed by mock data. To switch to a real backend,
// replace the implementations in this file without changing the signatures.

import type { Team, SignupList, ListStatus, UrgencyLevel } from "@/lib/types";
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
    // For walk-up songs, an entry is "filled" if the required fields have values
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

  if (!list.event) return "info";

  const eventDate = new Date(list.event.date);
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

// Group event-tied lists by their event (same date + opponent)
export type EventGroup = {
  date: string;
  time?: string;
  opponent?: string;
  location?: string;
  isHome: boolean;
  lists: SignupList[];
};

export function groupListsByEvent(lists: SignupList[]): EventGroup[] {
  const eventLists = lists.filter((l) => l.category === "event-tied" && l.event);
  const groups = new Map<string, EventGroup>();

  for (const list of eventLists) {
    const evt = list.event!;
    const key = `${evt.date}-${evt.opponent}`;
    if (!groups.has(key)) {
      groups.set(key, {
        date: evt.date,
        time: evt.time,
        opponent: evt.opponent,
        location: evt.location,
        isHome: evt.isHome,
        lists: [],
      });
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
