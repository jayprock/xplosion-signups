import { notFound } from "next/navigation";
import { getTeamBySlug } from "@/lib/data";
import { ListForm } from "@/components/list-form";
import { createListAction } from "../../actions";

export default async function CreateListPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);
  if (!team) notFound();

  async function handleCreate(data: Parameters<typeof createListAction>[1]) {
    "use server";
    return createListAction(teamSlug, data);
  }

  return (
    <ListForm
      teamSlug={teamSlug}
      teamName={team.name}
      onSubmit={handleCreate}
    />
  );
}
