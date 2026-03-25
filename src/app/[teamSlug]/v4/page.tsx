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
  ChevronRight,
  Music,
  Calendar,
  Mic2,
  ArrowRight,
  MapPin,
} from "lucide-react";

/* ─── Variation Nav ─── */
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

/* ─── Page ─── */
export default async function V4Timeline({
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

      {/* ═══ Timeline ═══ */}
      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-neutral-300" />

          {/* ── Pinned: Walk-Up Songs ── */}
          {standaloneLists.length > 0 && (
            <div className="relative mb-8">
              {/* Timeline node — star shape */}
              <div className="absolute left-5 top-5 -translate-x-1/2 size-4 bg-amber-500 rounded-full ring-4 ring-amber-100 z-10" />

              <div className="ml-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                  Pinned
                </span>

                {standaloneLists.map((list) => (
                  <Link
                    key={list.id}
                    href={`/${teamSlug}/${list.slug}`}
                    className="group block mt-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl ring-1 ring-amber-200/60 shadow-sm p-4 hover:shadow-md hover:ring-amber-300/60 transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        <Mic2 className="size-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900">
                          {list.name}
                        </p>
                        <p className="text-sm text-amber-700/70">
                          {filledSlots} of {totalSlots} submitted
                        </p>
                      </div>
                      <ArrowRight className="size-5 text-amber-400 group-hover:text-amber-600 transition-colors shrink-0" />
                    </div>

                    {/* Mini song list */}
                    {allEntries.length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        {allEntries.slice(0, 4).map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Music className="size-3 text-amber-400 shrink-0" />
                            <span className="font-medium text-neutral-700 truncate">
                              {entry.values.playerName || "Player"}
                            </span>
                            {entry.values.songName && (
                              <span className="text-neutral-400 truncate">
                                — {entry.values.songName}
                              </span>
                            )}
                          </div>
                        ))}
                        {allEntries.length > 4 && (
                          <p className="text-xs text-amber-600/60 pl-5">
                            +{allEntries.length - 4} more
                          </p>
                        )}
                      </div>
                    )}

                    {/* Progress bar */}
                    <div className="h-1.5 bg-amber-200/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${totalSlots > 0 ? (filledSlots / totalSlots) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Timeline: Dated Events ── */}
          {dateGroups.map((group, gi) => (
            <div key={group.date} className="relative mb-6 last:mb-0">
              {/* Timeline node */}
              <div
                className={cn(
                  "absolute left-5 top-5 -translate-x-1/2 size-3 rounded-full ring-4 z-10",
                  group.lists.every(
                    (l) => getListStatus(l).level === "complete"
                  )
                    ? "bg-emerald-500 ring-emerald-100"
                    : "bg-neutral-400 ring-neutral-200"
                )}
              />

              <div className="ml-12">
                {/* Date label */}
                <p className="text-xs font-semibold text-neutral-500 mb-2">
                  {formatDate(group.date)}
                </p>

                {/* Event card */}
                <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm overflow-hidden">
                  {group.lists.map((list, i) => {
                    const status = getListStatus(list);
                    return (
                      <Link
                        key={list.id}
                        href={`/${teamSlug}/${list.slug}`}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors group/row",
                          i < group.lists.length - 1 &&
                            "border-b border-neutral-100/80"
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
                          <StatusBadge level={status.level} />
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
                          <ChevronRight className="size-4 text-neutral-300 group-hover/row:text-neutral-500 transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Timeline end cap */}
          <div className="absolute left-5 bottom-0 -translate-x-1/2 size-2 bg-neutral-300 rounded-full" />
        </div>
      </main>
    </div>
  );
}
