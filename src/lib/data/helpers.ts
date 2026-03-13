// Pure computation helpers — no data fetching.
// Safe to import from client or server components.

import type { SignupList, ListStatus, UrgencyLevel } from "@/lib/types";

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

  return Array.from(groups.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getStandaloneLists(lists: SignupList[]): SignupList[] {
  return lists.filter((l) => l.category === "standalone");
}
