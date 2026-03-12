import { notFound } from "next/navigation";
import { getTeamBySlug } from "@/lib/data";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);
  if (!team) notFound();

  return <SettingsForm team={team} />;
}
