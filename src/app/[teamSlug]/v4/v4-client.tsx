"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Team, SignupList, ListStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import {
  ChevronRight,
  Music,
  Calendar,
  Check,
  X,
} from "lucide-react";

type ListWithStatus = SignupList & { _status: ListStatus };
type DateGroupData = { date: string; lists: ListWithStatus[] };
type DutyGroup = {
  name: string;
  category: string;
  filled: number;
  total: number;
  lists: ListWithStatus[];
};

/* ─── Variation Nav ─── */
function VariationNav({
  current,
  teamSlug,
}: {
  current: number;
  teamSlug: string;
}) {
  const names = [
    "Category Tabs",
    "Pinned",
    "Filter Chips",
    "Dashboard Tiles",
    "Tabs + Pinned",
    "Themed Tabs",
    "Dashboard",
  ];
  return (
    <div className="bg-black/90 backdrop-blur-sm border-b border-white/5 px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {current > 1 ? (
          <Link
            href={`/${teamSlug}/v${current - 1}`}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            ← V{current - 1}
          </Link>
        ) : (
          <span className="text-neutral-700">← Prev</span>
        )}
        <span className="text-neutral-500 font-medium">
          V{current} · {names[current - 1]}
        </span>
        {current < 7 ? (
          <Link
            href={`/${teamSlug}/v${current + 1}`}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            V{current + 1} →
          </Link>
        ) : (
          <span className="text-neutral-700">Next →</span>
        )}
      </div>
      <Link
        href={`/${teamSlug}`}
        className="text-neutral-500 hover:text-white transition-colors"
      >
        Original ↗
      </Link>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/* ─── Main Client ─── */
export function V4Client({
  team,
  teamSlug,
  dateGroups,
  standaloneLists,
  dutyGroups,
}: {
  team: Team;
  teamSlug: string;
  dateGroups: DateGroupData[];
  standaloneLists: ListWithStatus[];
  dutyGroups: DutyGroup[];
}) {
  const [activeTile, setActiveTile] = useState<string | null>(null);

  // Filter lists based on active tile
  const filteredDateGroups = activeTile
    ? dateGroups
        .map((g) => ({
          ...g,
          lists: g.lists.filter((l) => l.name === activeTile),
        }))
        .filter((g) => g.lists.length > 0)
    : dateGroups;

  const filteredStandalone = activeTile
    ? standaloneLists.filter((l) => l.name === activeTile)
    : standaloneLists;

  return (
    <div className="min-h-dvh bg-neutral-100">
      <VariationNav current={4} teamSlug={teamSlug} />

      {/* Header */}
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-5">
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            {team.name.toUpperCase()}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Coach {team.coachLastName} &middot; {team.seasonYear}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* ═══ Dashboard Tiles ═══ */}
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1 mb-3">
            Signup Status
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {dutyGroups.map((group) => {
              const isActive = activeTile === group.name;
              const isComplete = group.filled >= group.total;
              const pct =
                group.total > 0 ? (group.filled / group.total) * 100 : 0;

              return (
                <button
                  key={group.name}
                  onClick={() =>
                    setActiveTile(isActive ? null : group.name)
                  }
                  className={cn(
                    "text-left rounded-xl p-3 transition-all ring-1",
                    isActive
                      ? "bg-neutral-900 text-white ring-neutral-900 shadow-lg"
                      : "bg-white ring-black/[0.04] shadow-sm hover:shadow-md"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        "text-xs font-semibold truncate",
                        isActive ? "text-white" : "text-neutral-700"
                      )}
                    >
                      {group.name}
                    </span>
                    {isActive ? (
                      <X className="size-3 text-neutral-400 shrink-0" />
                    ) : isComplete ? (
                      <Check className="size-3 text-emerald-500 shrink-0" />
                    ) : group.category === "standalone" ? (
                      <Music className="size-3 text-neutral-300 shrink-0" />
                    ) : null}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={cn(
                        "font-heading text-2xl leading-none",
                        isActive
                          ? "text-white"
                          : isComplete
                            ? "text-emerald-600"
                            : "text-neutral-900"
                      )}
                    >
                      {group.filled}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        isActive ? "text-neutral-400" : "text-neutral-400"
                      )}
                    >
                      / {group.total}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div
                    className={cn(
                      "h-1 rounded-full mt-2 overflow-hidden",
                      isActive ? "bg-white/20" : "bg-neutral-100"
                    )}
                  >
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isComplete
                          ? "bg-emerald-500"
                          : isActive
                            ? "bg-white"
                            : "bg-neutral-400"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ═══ Filtered List ═══ */}
        {activeTile && (
          <div className="text-center">
            <span className="text-xs text-neutral-400">
              Showing: <strong className="text-neutral-600">{activeTile}</strong>
            </span>
          </div>
        )}

        {/* Standalone lists */}
        {filteredStandalone.length > 0 && (
          <section className="space-y-4">
            {!activeTile && (
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
                Team Lists
              </h2>
            )}
            {filteredStandalone.map((list) => (
              <Link
                key={list.id}
                href={`/${teamSlug}/${list.slug}`}
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
                      {list._status.filled} of {list._status.total} submitted
                    </p>
                  </div>
                  <ChevronRight className="size-5 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </section>
        )}

        {/* Dated events */}
        {filteredDateGroups.length > 0 && (
          <section className="space-y-4">
            {!activeTile && (
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
                Upcoming
              </h2>
            )}
            {filteredDateGroups.map((group) => (
              <DateCard
                key={group.date}
                group={group}
                teamSlug={teamSlug}
              />
            ))}
          </section>
        )}

        {filteredDateGroups.length === 0 &&
          filteredStandalone.length === 0 &&
          activeTile && (
            <p className="text-center text-neutral-400 text-sm py-8">
              No signups for &ldquo;{activeTile}&rdquo;
            </p>
          )}
      </main>
    </div>
  );
}

/* ─── DateCard ─── */
function DateCard({
  group,
  teamSlug,
}: {
  group: DateGroupData;
  teamSlug: string;
}) {
  const allDone = group.lists.every((l) => l._status.level === "complete");
  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-900">
          <Calendar className="size-3.5 text-neutral-400" />
          {formatDate(group.date)}
        </span>
        <StatusBadge level={allDone ? "complete" : "urgent"} />
      </div>
      <div className="border-t border-neutral-100/80">
        {group.lists.map((list, i) => (
          <Link
            key={list.id}
            href={`/${teamSlug}/${list.slug}`}
            className={cn(
              "flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors",
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
                  list._status.level === "complete"
                    ? "text-emerald-600"
                    : "text-neutral-400"
                )}
              >
                {list._status.filled}/{list._status.total}
              </span>
              <ChevronRight className="size-4 text-neutral-300" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
