import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  getTeamBySlug,
  getSignupListsForTeam,
  groupListsByDate,
  getStandaloneLists,
  getListStatus,
  type DateGroup,
} from "@/lib/data";
import type { SignupList } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import {
  ArrowLeft,
  ChevronRight,
  Music,
  Calendar,
  Shield,
} from "lucide-react";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function isAllComplete(lists: SignupList[]): boolean {
  return lists.every((list) => getListStatus(list).level === "complete");
}

export default async function TeamDashboardPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = await getTeamBySlug(teamSlug);
  if (!team) notFound();

  const allLists = await getSignupListsForTeam(team.id);
  const dateGroups = groupListsByDate(allLists);
  const standaloneLists = getStandaloneLists(allLists);

  return (
    <div className="min-h-dvh bg-neutral-100">
      {/* Header */}
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm mb-3"
          >
            <ArrowLeft className="size-3.5" />
            Home
          </Link>
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            {team.name.toUpperCase()}
          </h1>
          <div className="flex items-center justify-between mt-1">
            <p className="text-neutral-500 text-sm">
              Coach {team.coachLastName} &middot; {team.seasonYear}
            </p>
            <Link
              href={`/t/${teamSlug}/admin`}
              className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-white text-xs font-medium transition-colors"
            >
              <Shield className="size-3" />
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Upcoming sign-ups grouped by date */}
        {dateGroups.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
              Upcoming
            </h2>
            {dateGroups.map((group) => (
              <DateCard
                key={group.date}
                group={group}
                teamSlug={teamSlug}
              />
            ))}
          </section>
        )}

        {/* Standalone lists */}
        {standaloneLists.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
              Team Lists
            </h2>
            {standaloneLists.map((list) => {
              const status = getListStatus(list);
              return (
                <Link
                  key={list.id}
                  href={`/t/${teamSlug}/${list.slug}`}
                  className="group block bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4 hover:shadow-md hover:ring-black/[0.08] transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                      <Music className="size-5 text-neutral-400 group-hover:text-red-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">
                        {list.name}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {status.filled} of {status.total} submitted
                      </p>
                    </div>
                    <ChevronRight className="size-5 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0" />
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

function DateCard({
  group,
  teamSlug,
}: {
  group: DateGroup;
  teamSlug: string;
}) {
  const allDone = isAllComplete(group.lists);

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm overflow-hidden">
      {/* Date header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-900">
          <Calendar className="size-3.5 text-neutral-400" />
          {formatDate(group.date)}
        </span>
        <StatusBadge level={allDone ? "complete" : "urgent"} />
      </div>

      {/* Duty rows */}
      <div className="border-t border-neutral-100/80">
        {group.lists.map((list, i) => {
          const status = getListStatus(list);
          return (
            <Link
              key={list.id}
              href={`/t/${teamSlug}/${list.slug}`}
              className={cn(
                "flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors active:bg-neutral-100 group/row",
                i < group.lists.length - 1 && "border-b border-neutral-100/80"
              )}
            >
              <div className="min-w-0">
                <span className="font-medium text-neutral-700 text-sm">
                  {list.name}
                </span>
                {list.note && (
                  <span className="text-neutral-400 text-xs ml-2">
                    {list.note}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={cn(
                    "text-sm tabular-nums font-medium",
                    status.level === "complete"
                      ? "text-emerald-600"
                      : "text-neutral-400"
                  )}
                >
                  {status.filled}/{status.total}
                </span>
                <FillDots
                  filled={status.filled}
                  total={status.total}
                />
                <ChevronRight className="size-4 text-neutral-300 group-hover/row:text-neutral-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FillDots({
  filled,
  total,
}: {
  filled: number;
  total: number;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "size-2 rounded-full",
            i < filled ? "bg-neutral-900" : "bg-neutral-200"
          )}
        />
      ))}
    </div>
  );
}
