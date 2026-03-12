import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  getTeamBySlug,
  getSignupListsForTeam,
  getListStatus,
} from "@/lib/data";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Settings,
  Calendar,
  List,
} from "lucide-react";
import { DeleteListButton } from "./delete-list-button";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);
  if (!team) notFound();

  const allLists = getSignupListsForTeam(team.id);

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-5">
          <Link
            href={`/t/${teamSlug}`}
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm mb-3"
          >
            <ArrowLeft className="size-3.5" />
            Team Page
          </Link>
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            ADMIN DASHBOARD
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {team.name} &middot; Coach {team.coachLastName}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Action bar */}
        <div className="flex gap-3">
          <Link
            href={`/t/${teamSlug}/admin/lists/new`}
            className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="size-4" />
            Create New List
          </Link>
          <Link
            href={`/t/${teamSlug}/admin/settings`}
            className="h-11 px-4 rounded-xl bg-white ring-1 ring-black/[0.04] shadow-sm text-neutral-600 text-sm font-medium hover:shadow-md hover:ring-black/[0.08] transition-all flex items-center gap-2"
          >
            <Settings className="size-4" />
            Settings
          </Link>
        </div>

        {/* Lists */}
        {allLists.length === 0 ? (
          <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-8 text-center">
            <div className="size-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <List className="size-7 text-neutral-300" />
            </div>
            <p className="font-semibold text-neutral-900 mb-1">
              No signup lists yet
            </p>
            <p className="text-sm text-neutral-500 mb-4">
              Create your first list to get started
            </p>
            <Link
              href={`/t/${teamSlug}/admin/lists/new`}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-all"
            >
              <Plus className="size-4" />
              Create List
            </Link>
          </div>
        ) : (
          <section className="space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
              All Lists ({allLists.length})
            </h2>
            {allLists.map((list) => {
              const status = getListStatus(list);
              return (
                <div
                  key={list.id}
                  className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                        list.category === "dated"
                          ? "bg-blue-50"
                          : "bg-purple-50"
                      )}
                    >
                      {list.category === "dated" ? (
                        <Calendar className="size-4.5 text-blue-500" />
                      ) : (
                        <List className="size-4.5 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">
                        {list.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {list.date && (
                          <span className="text-xs text-neutral-400">
                            {formatDate(list.date)}
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-xs font-medium",
                            status.level === "complete"
                              ? "text-emerald-600"
                              : "text-neutral-400"
                          )}
                        >
                          {status.filled}/{status.total} filled
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/t/${teamSlug}/admin/lists/${list.slug}/edit`}
                        className="size-9 rounded-lg hover:bg-neutral-100 flex items-center justify-center transition-colors text-neutral-400 hover:text-neutral-700"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <DeleteListButton
                        teamSlug={teamSlug}
                        listId={list.id}
                        listName={list.name}
                        entryCount={list.entries.length}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
