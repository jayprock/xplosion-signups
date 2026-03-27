import { notFound } from "next/navigation";
import {
  getTeamBySlug,
  getSignupListsForTeam,
  groupListsByDate,
  getStandaloneLists,
  getListStatus,
} from "@/lib/data";
import { V6Client } from "./v6-client";

export default async function V6Page({
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

  return (
    <V6Client
      team={team}
      teamSlug={teamSlug}
      dateGroups={dateGroups}
      pastDateGroups={pastDateGroups}
      standaloneLists={standaloneLists}
    />
  );
}
