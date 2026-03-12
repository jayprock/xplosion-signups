import { notFound } from "next/navigation";
import { getTeamBySlug } from "@/lib/data";
import { ListForm } from "../../list-form";

export default async function CreateListPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);
  if (!team) notFound();

  return <ListForm mode="create" teamSlug={teamSlug} teamName={team.name} />;
}
