import Link from "next/link";
import { notFound } from "next/navigation";
import { getTeamBySlug, getSignupListBySlug } from "@/lib/data";
import { updateListAction } from "../../../actions";
import { ListForm } from "../../../list-form";
import { ArrowLeft } from "lucide-react";

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

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-5">
          <Link
            href={`/t/${teamSlug}/admin`}
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm mb-3"
          >
            <ArrowLeft className="size-3.5" />
            Dashboard
          </Link>
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            EDIT LIST
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {team.name} &middot; {list.name}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <ListForm
          teamSlug={teamSlug}
          initialData={list}
          action={async () => null}
          actionWithId={updateListAction}
          submitLabel="Save Changes"
        />
      </main>
    </div>
  );
}
