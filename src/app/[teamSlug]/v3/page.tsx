import { notFound } from "next/navigation";
import {
  getTeamBySlug,
  getSignupListsForTeam,
  groupListsByDate,
  getStandaloneLists,
  getListStatus,
} from "@/lib/data";
import { V3Tabs } from "./v3-tabs";

export default async function V3TabbedPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = await getTeamBySlug(teamSlug);
  if (!team) notFound();

  const allLists = await getSignupListsForTeam(team.id);
  const dateGroups = groupListsByDate(allLists);
  const standaloneLists = getStandaloneLists(allLists);

  // Pre-compute statuses for serialization
  const dateGroupsData = dateGroups.map((g) => ({
    date: g.date,
    lists: g.lists.map((l) => ({
      ...l,
      _status: getListStatus(l),
    })),
  }));

  const standaloneData = standaloneLists.map((l) => ({
    ...l,
    _status: getListStatus(l),
  }));

  return (
    <V3Tabs
      team={team}
      teamSlug={teamSlug}
      dateGroups={dateGroupsData}
      standaloneLists={standaloneData}
    />
  );
}
