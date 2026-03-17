import { notFound } from "next/navigation";
import { getTeamBySlug, getSignupListBySlug } from "@/lib/data";
import { ListForm } from "../../../list-form";

export default async function EditListPage({
  params,
}: {
  params: Promise<{ teamSlug: string; listSlug: string }>;
}) {
  const { teamSlug, listSlug } = await params;
  const team = await getTeamBySlug(teamSlug);
  if (!team) notFound();

  const list = await getSignupListBySlug(team.id, listSlug);
  if (!list) notFound();

  return (
    <ListForm
      mode="edit"
      teamSlug={teamSlug}
      teamName={team.name}
      list={list}
    />
  );
}
