import { notFound } from "next/navigation";
import { getTeamBySlug, getPlayersForTeam } from "@/lib/data";
import { NewListFlow } from "./new-list-flow";

export default async function CreateListPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = await getTeamBySlug(teamSlug);
  if (!team) notFound();

  const players = await getPlayersForTeam(team.id);

  return (
    <NewListFlow
      teamSlug={teamSlug}
      teamName={team.name}
      players={players}
    />
  );
}
