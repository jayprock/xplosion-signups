import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  getTeamBySlug,
  getSignupListsForTeam,
  groupListsByEvent,
  getStandaloneLists,
  getListStatus,
  type EventGroup,
} from "@/lib/data";
import type { SignupList, UrgencyLevel } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import {
  ArrowLeft,
  ChevronRight,
  Music,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getWorstUrgency(lists: SignupList[]): UrgencyLevel {
  const priority: UrgencyLevel[] = [
    "urgent",
    "high",
    "warning",
    "info",
    "complete",
  ];
  let worst: UrgencyLevel = "complete";
  for (const list of lists) {
    const status = getListStatus(list);
    if (priority.indexOf(status.level) < priority.indexOf(worst)) {
      worst = status.level;
    }
  }
  return worst;
}

const urgencyBorder: Record<UrgencyLevel, string> = {
  urgent: "border-l-red-500",
  high: "border-l-orange-500",
  warning: "border-l-amber-500",
  info: "border-l-sky-400",
  complete: "border-l-emerald-500",
};

export default async function TeamDashboardPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);
  if (!team) notFound();

  const allLists = getSignupListsForTeam(team.id);
  const eventGroups = groupListsByEvent(allLists);
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
          <p className="text-neutral-500 text-sm mt-1">
            Coach {team.coachLastName} &middot; {team.seasonYear}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Game sections */}
        {eventGroups.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
              Upcoming Games
            </h2>
            {eventGroups.map((group) => (
              <GameCard
                key={`${group.date}-${group.opponent}`}
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

function GameCard({
  group,
  teamSlug,
}: {
  group: EventGroup;
  teamSlug: string;
}) {
  const urgency = getWorstUrgency(group.lists);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm overflow-hidden border-l-[3px]",
        urgencyBorder[urgency]
      )}
    >
      {/* Game header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading text-xl tracking-tight text-neutral-900 leading-none">
            VS {(group.opponent || "TBD").toUpperCase()}
          </h3>
          <StatusBadge level={urgency} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5 text-neutral-400" />
            {formatDate(group.date)}
          </span>
          {group.time && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-neutral-400" />
              {group.time}
            </span>
          )}
          {group.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-neutral-400" />
              {group.location}
            </span>
          )}
          <span className="text-neutral-400 text-xs uppercase tracking-wider font-medium">
            {group.isHome ? "Home" : "Away"}
          </span>
        </div>
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
              <span className="font-medium text-neutral-700 text-sm">
                {list.name}
              </span>
              <div className="flex items-center gap-3">
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
                  level={status.level}
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
  level,
}: {
  filled: number;
  total: number;
  level: UrgencyLevel;
}) {
  const dotColor =
    level === "complete"
      ? "bg-emerald-500"
      : level === "urgent"
        ? "bg-red-500"
        : level === "high"
          ? "bg-orange-500"
          : level === "warning"
            ? "bg-amber-500"
            : "bg-sky-500";

  return (
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "size-2 rounded-full",
            i < filled ? dotColor : "bg-neutral-200"
          )}
        />
      ))}
    </div>
  );
}
