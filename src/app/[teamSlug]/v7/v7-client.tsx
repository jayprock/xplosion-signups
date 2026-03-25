"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Team, SignupList, ListStatus } from "@/lib/types";
import {
  ChevronRight,
  ChevronDown,
  Music,
  Calendar,
  Check,
  ClipboardList,
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

/* ─── Accordion Section ─── */
function DutySection({
  group,
  teamSlug,
  defaultOpen,
}: {
  group: DutyGroup;
  teamSlug: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);
  const isComplete = group.filled >= group.total;
  const pct = group.total > 0 ? (group.filled / group.total) * 100 : 0;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm overflow-hidden transition-all",
        isOpen && "shadow-md"
      )}
    >
      {/* Section header — clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-4 flex items-center gap-3 hover:bg-neutral-50/50 transition-colors"
      >
        {/* Icon */}
        <div
          className={cn(
            "size-10 rounded-xl flex items-center justify-center shrink-0",
            isComplete ? "bg-emerald-50" : "bg-neutral-100"
          )}
        >
          {group.category === "standalone" ? (
            <Music
              className={cn(
                "size-5",
                isComplete ? "text-emerald-500" : "text-neutral-400"
              )}
            />
          ) : (
            <ClipboardList
              className={cn(
                "size-5",
                isComplete ? "text-emerald-500" : "text-neutral-400"
              )}
            />
          )}
        </div>

        {/* Name + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-neutral-900 text-sm truncate">
              {group.name}
            </p>
            <span
              className={cn(
                "text-sm tabular-nums font-semibold ml-2 shrink-0",
                isComplete ? "text-emerald-600" : "text-neutral-400"
              )}
            >
              {group.filled}/{group.total}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isComplete ? "bg-emerald-500" : "bg-neutral-900"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Expand chevron */}
        <ChevronDown
          className={cn(
            "size-4 text-neutral-400 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="border-t border-neutral-100/80">
          {group.category === "standalone"
            ? /* Standalone: show entries */
              group.lists.map((list) => (
                <div key={list.id}>
                  {/* If multiple standalone lists with same name, show list name */}
                  {group.lists.length > 1 && (
                    <div className="px-4 pt-2 pb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                        {list.name}
                      </span>
                    </div>
                  )}
                  {list.entries.map((entry, i) => {
                    const hasSong = !!entry.values.songName;
                    return (
                      <Link
                        key={entry.id}
                        href={`/${teamSlug}/${list.slug}`}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors",
                          i < list.entries.length - 1 &&
                            "border-b border-neutral-100/60"
                        )}
                      >
                        <div
                          className={cn(
                            "size-6 rounded-full flex items-center justify-center shrink-0",
                            hasSong ? "bg-emerald-100" : "bg-amber-100"
                          )}
                        >
                          {hasSong ? (
                            <Check className="size-3 text-emerald-600" />
                          ) : (
                            <Music className="size-3 text-amber-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium text-neutral-700">
                            {entry.values.playerName || "Player"}
                          </span>
                          {hasSong ? (
                            <p className="text-xs text-neutral-400 truncate">
                              {entry.values.songName}
                              {entry.values.artistName &&
                                ` — ${entry.values.artistName}`}
                            </p>
                          ) : (
                            <p className="text-xs text-amber-500 italic">
                              Song not yet submitted
                            </p>
                          )}
                        </div>
                        <ChevronRight className="size-3.5 text-neutral-300 shrink-0" />
                      </Link>
                    );
                  })}
                  {/* Empty slots */}
                  {list.entries.length < list.slotsNeeded &&
                    Array.from(
                      {
                        length: list.slotsNeeded - list.entries.length,
                      },
                      (_, i) => (
                        <div
                          key={`empty-${list.id}-${i}`}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5",
                            i <
                              list.slotsNeeded -
                                list.entries.length -
                                1 &&
                              "border-b border-neutral-100/60"
                          )}
                        >
                          <div className="size-6 rounded-full bg-neutral-100 shrink-0" />
                          <span className="text-sm text-neutral-300 italic">
                            Awaiting signup
                          </span>
                        </div>
                      )
                    )}
                  {/* CTA */}
                  <Link
                    href={`/${teamSlug}/${list.slug}`}
                    className="flex items-center justify-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-500 py-3 transition-colors border-t border-neutral-100/60"
                  >
                    View & Sign Up
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              ))
            : /* Dated: show each date instance */
              group.lists
                .sort(
                  (a, b) =>
                    new Date(a.date ?? "").getTime() -
                    new Date(b.date ?? "").getTime()
                )
                .map((list, i) => (
                  <Link
                    key={list.id}
                    href={`/${teamSlug}/${list.slug}`}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors",
                      i < group.lists.length - 1 &&
                        "border-b border-neutral-100/80"
                    )}
                  >
                    <div className="min-w-0">
                      <span className="text-sm text-neutral-700 font-medium">
                        {list.date ? formatDate(list.date) : "No date"}
                      </span>
                      {list.note && (
                        <span className="text-neutral-400 text-xs ml-2">
                          {list.note}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {list._status.level === "complete" ? (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Complete
                        </span>
                      ) : (
                        <span className="text-sm tabular-nums font-medium text-neutral-400">
                          {list._status.filled}/{list._status.total}
                        </span>
                      )}
                      <ChevronRight className="size-4 text-neutral-300" />
                    </div>
                  </Link>
                ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Client ─── */
export function V7Client({
  team,
  teamSlug,
  dutyGroups,
}: {
  team: Team;
  teamSlug: string;
  dateGroups: DateGroupData[];
  standaloneLists: ListWithStatus[];
  dutyGroups: DutyGroup[];
}) {
  // Sort: incomplete first, then by name
  const sorted = [...dutyGroups].sort((a, b) => {
    const aComplete = a.filled >= a.total ? 1 : 0;
    const bComplete = b.filled >= b.total ? 1 : 0;
    if (aComplete !== bComplete) return aComplete - bComplete;
    return a.name.localeCompare(b.name);
  });

  const totalFilled = dutyGroups.reduce((s, g) => s + g.filled, 0);
  const totalNeeded = dutyGroups.reduce((s, g) => s + g.total, 0);
  const overallPct =
    totalNeeded > 0 ? Math.round((totalFilled / totalNeeded) * 100) : 0;

  return (
    <div className="min-h-dvh bg-neutral-50">
      <VariationNav current={7} teamSlug={teamSlug} />

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

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Overall summary */}
        <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Overall Progress
            </span>
            <span className="font-heading text-2xl text-neutral-900 leading-none">
              {overallPct}%
            </span>
          </div>
          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                overallPct >= 100 ? "bg-emerald-500" : "bg-neutral-900"
              )}
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            {totalFilled} of {totalNeeded} signups filled across{" "}
            {dutyGroups.length} categories
          </p>
        </div>

        {/* Duty sections */}
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1 pt-2">
          By Category
        </h2>
        {sorted.map((group, i) => (
          <DutySection
            key={group.name}
            group={group}
            teamSlug={teamSlug}
            defaultOpen={i === 0}
          />
        ))}
      </main>
    </div>
  );
}
