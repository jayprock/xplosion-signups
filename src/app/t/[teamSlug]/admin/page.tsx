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
  Settings,
  Calendar,
  ListChecks,
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

  // Sort: dated by date ascending, then standalone
  const sorted = [...allLists].sort((a, b) => {
    if (a.category === "dated" && b.category === "standalone") return -1;
    if (a.category === "standalone" && b.category === "dated") return 1;
    if (a.date && b.date) return a.date.localeCompare(b.date);
    return 0;
  });

  return (
    <div className="min-h-dvh bg-neutral-100">
      {/* Header */}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl tracking-tight leading-none">
                ADMIN
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                {team.name} &middot; Coach {team.coachLastName}
              </p>
            </div>
            <Link
              href={`/t/${teamSlug}/admin/settings`}
              className="size-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center transition-colors"
            >
              <Settings className="size-4 text-neutral-400" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Actions */}
        <div>
          <Link
            href={`/t/${teamSlug}/admin/lists/new`}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 transition-all"
          >
            <Plus className="size-4" />
            Create New List
          </Link>
        </div>

        {/* Lists */}
        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-8 text-center">
            <ListChecks className="size-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">
              No signup lists yet. Create your first one to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
              Signup Lists ({sorted.length})
            </h2>
            {sorted.map((list) => {
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
                          : "bg-neutral-100"
                      )}
                    >
                      {list.category === "dated" ? (
                        <Calendar className="size-4 text-blue-500" />
                      ) : (
                        <ListChecks className="size-4 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">
                        {list.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-neutral-500">
                        {list.date && (
                          <span>{formatDate(list.date)}</span>
                        )}
                        {list.time && <span>{list.time}</span>}
                        <span
                          className={cn(
                            "font-medium tabular-nums",
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
                        <Pencil className="size-3.5" />
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
          </div>
        )}
      </main>
    </div>
  );
}
