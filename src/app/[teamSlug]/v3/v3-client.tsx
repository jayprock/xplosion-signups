"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Team, SignupList, ListStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { ChevronRight, Music, Calendar, X } from "lucide-react";

type ListWithStatus = SignupList & { _status: ListStatus };
type DateGroupData = { date: string; lists: ListWithStatus[] };

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

/* ─── Chip colors by index ─── */
const chipColors = [
  "bg-sky-100 text-sky-700 ring-sky-200",
  "bg-amber-100 text-amber-700 ring-amber-200",
  "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "bg-rose-100 text-rose-700 ring-rose-200",
  "bg-violet-100 text-violet-700 ring-violet-200",
  "bg-orange-100 text-orange-700 ring-orange-200",
  "bg-teal-100 text-teal-700 ring-teal-200",
  "bg-pink-100 text-pink-700 ring-pink-200",
];

/* ─── Main Client ─── */
export function V3Client({
  team,
  teamSlug,
  dateGroups,
  standaloneLists,
}: {
  team: Team;
  teamSlug: string;
  dateGroups: DateGroupData[];
  standaloneLists: ListWithStatus[];
}) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Build filter chips from unique list names
  const chips = useMemo(() => {
    const chipMap = new Map<
      string,
      { name: string; filled: number; total: number; category: string }
    >();

    for (const group of dateGroups) {
      for (const list of group.lists) {
        const existing = chipMap.get(list.name);
        if (existing) {
          existing.filled += list._status.filled;
          existing.total += list._status.total;
        } else {
          chipMap.set(list.name, {
            name: list.name,
            filled: list._status.filled,
            total: list._status.total,
            category: list.category,
          });
        }
      }
    }

    for (const list of standaloneLists) {
      const existing = chipMap.get(list.name);
      if (existing) {
        existing.filled += list._status.filled;
        existing.total += list._status.total;
      } else {
        chipMap.set(list.name, {
          name: list.name,
          filled: list._status.filled,
          total: list._status.total,
          category: list.category,
        });
      }
    }

    return Array.from(chipMap.values());
  }, [dateGroups, standaloneLists]);

  // Filter lists
  const filteredDateGroups = activeFilter
    ? dateGroups
        .map((g) => ({
          ...g,
          lists: g.lists.filter((l) => l.name === activeFilter),
        }))
        .filter((g) => g.lists.length > 0)
    : dateGroups;

  const filteredStandalone = activeFilter
    ? standaloneLists.filter((l) => l.name === activeFilter)
    : standaloneLists;

  return (
    <div className="min-h-dvh bg-neutral-100">
      <VariationNav current={3} teamSlug={teamSlug} />

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

      {/* Filter Chips */}
      <div className="bg-white border-b border-neutral-200 sticky top-[33px] z-40">
        <div className="max-w-lg mx-auto px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-none">
          {/* "All" chip */}
          <button
            onClick={() => setActiveFilter(null)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 transition-all",
              activeFilter === null
                ? "bg-neutral-900 text-white ring-neutral-900"
                : "bg-white text-neutral-500 ring-neutral-200 hover:ring-neutral-300"
            )}
          >
            All
          </button>

          {chips.map((chip, i) => {
            const isActive = activeFilter === chip.name;
            const colorClass = chipColors[i % chipColors.length];
            const pending = chip.total - chip.filled;

            return (
              <button
                key={chip.name}
                onClick={() =>
                  setActiveFilter(isActive ? null : chip.name)
                }
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 transition-all flex items-center gap-1.5",
                  isActive
                    ? colorClass + " ring-current/20"
                    : "bg-white text-neutral-500 ring-neutral-200 hover:ring-neutral-300"
                )}
              >
                {chip.category === "standalone" && (
                  <Music className="size-3" />
                )}
                {chip.name}
                {pending > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center size-4 rounded-full text-[9px] font-bold",
                      isActive
                        ? "bg-white/50 text-current"
                        : "bg-neutral-100 text-neutral-400"
                    )}
                  >
                    {pending}
                  </span>
                )}
                {isActive && <X className="size-3 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Standalone lists */}
        {filteredStandalone.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
              Team Lists
            </h2>
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
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
              Upcoming
            </h2>
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
          filteredStandalone.length === 0 && (
            <p className="text-center text-neutral-400 text-sm py-12">
              No signups match this filter
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
