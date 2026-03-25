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
  Disc3,
  ListMusic,
  User,
} from "lucide-react";

type ListWithStatus = SignupList & { _status: ListStatus };
type DateGroupData = { date: string; lists: ListWithStatus[] };

function VariationNav({
  current,
  teamSlug,
}: {
  current: number;
  teamSlug: string;
}) {
  const names = [
    "Hero Spotlight",
    "Sticky Bar",
    "Tabbed",
    "Timeline",
    "Split View",
    "Music-Forward",
    "Progress",
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

// Warm gradients for album cards
const cardGradients = [
  "from-rose-500/80 to-orange-400/80",
  "from-violet-600/80 to-fuchsia-400/80",
  "from-sky-500/80 to-cyan-300/80",
  "from-emerald-500/80 to-teal-300/80",
  "from-amber-500/80 to-yellow-300/80",
  "from-pink-500/80 to-rose-300/80",
  "from-indigo-500/80 to-blue-300/80",
  "from-lime-500/80 to-green-300/80",
];

export function V3Tabs({
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
  const [activeTab, setActiveTab] = useState<"schedule" | "songs">("songs");

  const totalSlots = standaloneLists.reduce(
    (sum, l) => sum + l.slotsNeeded,
    0
  );
  const filledSlots = standaloneLists.reduce(
    (sum, l) => sum + l.entries.length,
    0
  );
  const allEntries = standaloneLists.flatMap((l) =>
    l.entries.map((e) => ({ ...e, listSlug: l.slug }))
  );

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

      {/* Tab Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-[33px] z-40">
        <div className="max-w-lg mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab("songs")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors",
              activeTab === "songs"
                ? "border-red-500 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            <ListMusic className="size-4" />
            Walk-Up Songs
            {filledSlots < totalSlots && (
              <span className="size-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {totalSlots - filledSlots}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors",
              activeTab === "schedule"
                ? "border-red-500 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            <Calendar className="size-4" />
            Schedule
          </button>
        </div>
      </div>

      {/* ═══ SONGS TAB ═══ */}
      {activeTab === "songs" && (
        <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Progress summary */}
          <div className="text-center">
            <p className="text-neutral-400 text-sm">
              <span className="font-heading text-3xl text-neutral-900 mr-1">
                {filledSlots}
              </span>
              of {totalSlots} songs submitted
            </p>
          </div>

          {/* Album-art song cards */}
          <div className="grid grid-cols-2 gap-3">
            {allEntries.map((entry, i) => (
              <Link
                key={entry.id}
                href={`/${teamSlug}/${entry.listSlug}`}
                className="group relative overflow-hidden rounded-2xl aspect-square flex flex-col justify-end p-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Gradient background */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br",
                    cardGradients[i % cardGradients.length]
                  )}
                />
                {/* Vinyl decoration */}
                <div className="absolute top-3 right-3 size-12 opacity-20">
                  <Disc3 className="size-full text-white" />
                </div>
                {/* Content */}
                <div className="relative z-10">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    #{i + 1}
                  </p>
                  <p className="text-white font-bold text-lg leading-tight truncate">
                    {entry.values.playerName || "Player"}
                  </p>
                  {entry.values.songName && (
                    <p className="text-white/70 text-sm truncate mt-0.5">
                      {entry.values.songName}
                    </p>
                  )}
                  {entry.values.artistName && (
                    <p className="text-white/50 text-xs truncate">
                      {entry.values.artistName}
                    </p>
                  )}
                </div>
              </Link>
            ))}

            {/* Empty slots as invitation cards */}
            {Array.from(
              {
                length: Math.max(0, totalSlots - filledSlots),
              },
              (_, i) => (
                <Link
                  key={`empty-${i}`}
                  href={`/${teamSlug}/${standaloneLists[0]?.slug ?? ""}`}
                  className="rounded-2xl aspect-square border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2 hover:border-red-400 hover:bg-red-50/50 transition-all group"
                >
                  <div className="size-10 rounded-full bg-neutral-200 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                    <User className="size-5 text-neutral-400 group-hover:text-red-500 transition-colors" />
                  </div>
                  <span className="text-neutral-400 group-hover:text-red-500 text-xs font-medium transition-colors">
                    Add Song
                  </span>
                </Link>
              )
            )}
          </div>
        </main>
      )}

      {/* ═══ SCHEDULE TAB ═══ */}
      {activeTab === "schedule" && (
        <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
          {dateGroups.length > 0 ? (
            <section className="space-y-4">
              {dateGroups.map((group) => {
                const allDone = group.lists.every(
                  (l) => l._status.level === "complete"
                );
                return (
                  <div
                    key={group.date}
                    className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm overflow-hidden"
                  >
                    <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-900">
                        <Calendar className="size-3.5 text-neutral-400" />
                        {formatDate(group.date)}
                      </span>
                      <StatusBadge
                        level={allDone ? "complete" : "urgent"}
                      />
                    </div>
                    <div className="border-t border-neutral-100/80">
                      {group.lists.map((list, i) => (
                        <Link
                          key={list.id}
                          href={`/${teamSlug}/${list.slug}`}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors",
                            i < group.lists.length - 1 &&
                              "border-b border-neutral-100/80"
                          )}
                        >
                          <span className="font-medium text-neutral-700 text-sm">
                            {list.name}
                          </span>
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
              })}
            </section>
          ) : (
            <p className="text-center text-neutral-400 text-sm py-12">
              No upcoming events
            </p>
          )}
        </main>
      )}
    </div>
  );
}
