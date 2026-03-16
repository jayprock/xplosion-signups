import { notFound } from "next/navigation";
import { getTeamBySlug, getPlayersForTeam } from "@/lib/data";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = await getTeamBySlug(teamSlug);
  if (!team) notFound();

  const players = await getPlayersForTeam(team.id);

  return <SettingsForm team={team} players={players} />;
}
