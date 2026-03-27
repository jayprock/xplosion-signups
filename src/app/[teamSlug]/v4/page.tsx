import { notFound } from "next/navigation";
import {
  getTeamBySlug,
  getSignupListsForTeam,
  groupListsByDate,
  getStandaloneLists,
  getListStatus,
} from "@/lib/data";
import type { SignupList, ListStatus } from "@/lib/types";
import { V4Client } from "./v4-client";

type LWS = SignupList & { _status: ListStatus };

function computeDutyGroups(allLists: SignupList[]) {
  const groupMap = new Map<
    string,
    {
      name: string;
      category: string;
      filled: number;
      total: number;
      lists: LWS[];
    }
  >();
  for (const list of allLists) {
    const status = getListStatus(list);
    const lws: LWS = { ...list, _status: status };
    const existing = groupMap.get(list.name);
    if (existing) {
      existing.lists.push(lws);
      existing.filled += status.filled;
      existing.total += status.total;
    } else {
      groupMap.set(list.name, {
        name: list.name,
        category: list.category,
        filled: status.filled,
        total: status.total,
        lists: [lws],
      });
    }
  }
  return Array.from(groupMap.values());
}

export default async function V4Page({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = await getTeamBySlug(teamSlug);
  if (!team) notFound();

  const allLists = await getSignupListsForTeam(team.id);

  const today = new Date().toISOString().split("T")[0];
  const allDateGroups = groupListsByDate(allLists).map((g) => ({
    date: g.date,
    lists: g.lists.map((l) => ({ ...l, _status: getListStatus(l) })),
  }));
  const dateGroups = allDateGroups.filter((g) => g.date >= today);
  const pastDateGroups = [...allDateGroups.filter((g) => g.date < today)].reverse();

  const standaloneLists = getStandaloneLists(allLists).map((l) => ({
    ...l,
    _status: getListStatus(l),
  }));

  const dutyGroups = computeDutyGroups(allLists);

  return (
    <V4Client
      team={team}
      teamSlug={teamSlug}
      dateGroups={dateGroups}
      pastDateGroups={pastDateGroups}
      standaloneLists={standaloneLists}
      dutyGroups={dutyGroups}
    />
  );
}
