"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Team, SignupList, ListStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { ChevronRight, Music, Calendar, Pin } from "lucide-react";

type ListWithStatus = SignupList & { _status: ListStatus };
type DateGroupData = { date: string; lists: ListWithStatus[] };
type Tab = "schedule" | "team-lists" | "all";

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
export function V5Client({
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
    <div className="min-h-dvh bg-neutral-100">
      <VariationNav current={5} teamSlug={teamSlug} />

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
            onClick={() => setActiveTab("schedule")}
            className={cn(
              "px-4 py-3 text-sm font-semibold border-b-2 transition-colors",
              activeTab === "schedule"
                ? "border-red-500 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab("team-lists")}
            className={cn(
              "px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5",
              activeTab === "team-lists"
                ? "border-red-500 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            Team Lists
            {pendingTeamLists > 0 && (
              <span className="size-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingTeamLists}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-4 py-3 text-sm font-semibold border-b-2 transition-colors",
              activeTab === "all"
                ? "border-red-500 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            All
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Schedule tab: pinned standalone at top, then events */}
        {activeTab === "schedule" && (
          <>
            {/* Pinned standalone lists */}
            {standaloneLists.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1 inline-flex items-center gap-1.5">
                  <Pin className="size-3" />
                  Pinned
                </h2>
                {standaloneLists.map((list) => (
                  <StandaloneCard
                    key={list.id}
                    list={list}
                    teamSlug={teamSlug}
                  />
                ))}
              </section>
            )}

            {/* Dated events */}
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
          </>
        )}

        {/* Team Lists tab */}
        {activeTab === "team-lists" && (
          <>
            {standaloneLists.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
                  Team Lists
                </h2>
                {standaloneLists.map((list) => (
                  <StandaloneCard
                    key={list.id}
                    list={list}
                    teamSlug={teamSlug}
                  />
                ))}
              </section>
            ) : (
              <p className="text-center text-neutral-400 text-sm py-12">
                No team lists
              </p>
            )}
          </>
        )}

        {/* All tab */}
        {activeTab === "all" && (
          <>
            {standaloneLists.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
                  Team Lists
                </h2>
                {standaloneLists.map((list) => (
                  <StandaloneCard
                    key={list.id}
                    list={list}
                    teamSlug={teamSlug}
                  />
                ))}
              </section>
            )}
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
          </>
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

/* ─── StandaloneCard ─── */
function StandaloneCard({
  list,
  teamSlug,
}: {
  list: ListWithStatus;
  teamSlug: string;
}) {
  return (
    <Link
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
  );
}
