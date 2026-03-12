import { notFound } from "next/navigation";
import { getTeamBySlug, getSignupListBySlug } from "@/lib/data";
import { ListForm } from "@/components/list-form";
import { updateListAction } from "../../../actions";

export default async function EditListPage({
  params,
}: {
  params: Promise<{ teamSlug: string; listSlug: string }>;
}) {
  const { teamSlug, listSlug } = await params;
  const team = getTeamBySlug(teamSlug);
  if (!team) notFound();

  const list = getSignupListBySlug(team.id, listSlug);
  if (!list) notFound();

  async function handleUpdate(data: Parameters<typeof updateListAction>[2]) {
    "use server";
    return updateListAction(teamSlug, list!.id, data);
  }

  return (
    <ListForm
      teamSlug={teamSlug}
      teamName={team.name}
      list={list}
      onSubmit={handleUpdate}
    />
  );
}
