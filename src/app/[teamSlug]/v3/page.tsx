import { notFound } from "next/navigation";
import {
  getTeamBySlug,
  getSignupListsForTeam,
  groupListsByDate,
  getStandaloneLists,
  getListStatus,
} from "@/lib/data";
import { V3Client } from "./v3-client";

export default async function V3Page({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = await getTeamBySlug(teamSlug);
  if (!team) notFound();

  const allLists = await getSignupListsForTeam(team.id);

  const dateGroups = groupListsByDate(allLists).map((g) => ({
    date: g.date,
    lists: g.lists.map((l) => ({ ...l, _status: getListStatus(l) })),
  }));

  const standaloneLists = getStandaloneLists(allLists).map((l) => ({
    ...l,
    _status: getListStatus(l),
  }));

  return (
    <V3Client
      team={team}
      teamSlug={teamSlug}
      dateGroups={dateGroups}
      standaloneLists={standaloneLists}
    />
  );
}
