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
} from "lucide-react";

type ListWithStatus = SignupList & { _status: ListStatus };
type DateGroupData = { date: string; lists: ListWithStatus[] };
type Tab = "schedule" | "team-lists";

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
export function V6Client({
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
  const [activeTab, setActiveTab] = useState<Tab>("schedule");

  const pendingTeamLists = standaloneLists.filter(
    (l) => l._status.level !== "complete"
  ).length;

  return (
    <div
      className={cn(
        "min-h-dvh transition-colors duration-300",
        activeTab === "team-lists" ? "bg-neutral-950" : "bg-neutral-100"
      )}
    >
      <VariationNav current={6} teamSlug={teamSlug} />

      {/* Header */}
      <header className="bg-neutral-950 text-white">
        <div
          className={cn(
            "h-1 bg-gradient-to-r",
            activeTab === "team-lists"
              ? "from-teal-900 via-teal-400 to-teal-900"
              : "from-red-900 via-red-500 to-red-900"
          )}
        />
        <div className="max-w-lg mx-auto px-4 py-5">
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            {team.name.toUpperCase()}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Coach {team.coachLastName} &middot; {team.seasonYear}
          </p>
        </div>
      </header>

      {/* Tab Bar — theme-aware */}
      <div
        className={cn(
          "border-b sticky top-[33px] z-40 transition-colors duration-300",
          activeTab === "team-lists"
            ? "bg-neutral-900/80 backdrop-blur-sm border-white/10"
            : "bg-white/80 backdrop-blur-sm border-neutral-200"
        )}
      >
        <div className="max-w-lg mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab("schedule")}
            className={cn(
              "px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5",
              activeTab === "schedule"
                ? "border-red-500 text-neutral-900"
                : activeTab === "team-lists"
                  ? "border-transparent text-neutral-500 hover:text-neutral-300"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            <Calendar className="size-4" />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab("team-lists")}
            className={cn(
              "px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5",
              activeTab === "team-lists"
                ? "border-teal-400 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            <ListMusic className="size-4" />
            Team Lists
            {pendingTeamLists > 0 && (
              <span
                className={cn(
                  "size-5 rounded-full text-[10px] font-bold flex items-center justify-center",
                  activeTab === "team-lists"
                    ? "bg-teal-500 text-white"
                    : "bg-red-500 text-white"
                )}
              >
                {pendingTeamLists}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ═══ Schedule Tab — Light ═══ */}
      {activeTab === "schedule" && (
        <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
          {dateGroups.length > 0 ? (
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
          ) : (
            <p className="text-center text-neutral-400 text-sm py-12">
              No upcoming events
            </p>
          )}
        </main>
      )}

      {/* ═══ Team Lists Tab — Dark/Music ═══ */}
      {activeTab === "team-lists" && (
        <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {standaloneLists.length > 0 ? (
            standaloneLists.map((list) => {
              const entries = list.entries;
              return (
                <section key={list.id}>
                  {/* Playlist header */}
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                      <Disc3 className="size-5 text-teal-400" />
                      {list.name}
                    </h2>
                    <span className="text-neutral-500 text-xs">
                      {list._status.filled}/{list._status.total}
                    </span>
                  </div>

                  {/* Playlist track list */}
                  <div className="bg-white/[0.04] rounded-2xl ring-1 ring-white/[0.06] overflow-hidden">
                    {entries.map((entry, i) => (
                      <Link
                        key={entry.id}
                        href={`/${teamSlug}/${list.slug}`}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors group",
                          i < entries.length - 1 &&
                            "border-b border-white/[0.04]"
                        )}
                      >
                        <span className="text-neutral-600 text-xs font-mono w-5 text-right shrink-0">
                          {i + 1}
                        </span>
                        <div className="size-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-600/10 flex items-center justify-center shrink-0">
                          <Music className="size-4 text-teal-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-sm font-medium truncate">
                            {entry.values.playerName || "Player"}
                          </p>
                          {entry.values.songName ? (
                            <p className="text-neutral-500 text-xs truncate">
                              {entry.values.songName}
                              {entry.values.artistName &&
                                ` — ${entry.values.artistName}`}
                            </p>
                          ) : (
                            <p className="text-neutral-600 text-xs italic">
                              Song not yet submitted
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}

                    {/* Empty slots */}
                    {list._status.filled < list._status.total &&
                      Array.from(
                        {
                          length: Math.max(
                            0,
                            list.slotsNeeded - entries.length
                          ),
                        },
                        (_, i) => (
                          <div
                            key={`empty-${i}`}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3",
                              i <
                                list.slotsNeeded - entries.length - 1 &&
                                "border-b border-white/[0.04]"
                            )}
                          >
                            <span className="text-neutral-700 text-xs font-mono w-5 text-right shrink-0">
                              {entries.length + i + 1}
                            </span>
                            <div className="size-8 rounded-lg bg-white/[0.03] flex items-center justify-center shrink-0">
                              <Music className="size-4 text-neutral-800" />
                            </div>
                            <span className="text-neutral-700 text-sm italic">
                              Awaiting submission
                            </span>
                          </div>
                        )
                      )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/${teamSlug}/${list.slug}`}
                    className="flex items-center justify-center gap-2 w-full bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-sm py-3 rounded-xl mt-3 transition-all active:scale-[0.98]"
                  >
                    Submit Your Entry
                    <ChevronRight className="size-4" />
                  </Link>
                </section>
              );
            })
          ) : (
            <p className="text-center text-neutral-500 text-sm py-12">
              No team lists
            </p>
          )}
        </main>
      )}
    </div>
  );
}

/* ─── DateCard (light theme) ─── */
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
