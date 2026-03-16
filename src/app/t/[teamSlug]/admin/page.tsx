import { notFound } from "next/navigation";
import { getTeamBySlug, getSignupListsForTeam } from "@/lib/data";
import { getListStatus } from "@/lib/data/helpers";
import { AdminDashboardClient } from "./dashboard-client";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = await getTeamBySlug(teamSlug);
  if (!team) notFound();

  const lists = await getSignupListsForTeam(team.id);
  const listsWithStatus = lists.map((list) => ({
    ...list,
    status: getListStatus(list),
  }));

  return <AdminDashboardClient team={team} lists={listsWithStatus} />;
}
