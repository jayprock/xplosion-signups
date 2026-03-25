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
  Disc3,
  ArrowRight,
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
export default async function V5Split({
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
      <VariationNav current={5} teamSlug={teamSlug} />

      {/* Header */}
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            {team.name.toUpperCase()}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Coach {team.coachLastName} &middot; {team.seasonYear}
          </p>
        </div>
      </header>

      {/* ═══ Split Layout ═══ */}
      <main className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[60dvh]">
          {/* ── Left: Walk-Up Songs (dark) ── */}
          <div className="bg-neutral-900 px-5 py-6 order-1">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4">
              Walk-Up Songs
            </h2>

            {standaloneLists.length > 0 ? (
              <div className="space-y-5">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-neutral-400 text-sm">
                      {filledSlots} of {totalSlots}
                    </span>
                    <span className="text-neutral-500 text-xs">
                      {totalSlots > 0
                        ? Math.round((filledSlots / totalSlots) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-amber-400 rounded-full"
                      style={{
                        width: `${totalSlots > 0 ? (filledSlots / totalSlots) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Song list */}
                <div className="space-y-2">
                  {allEntries.map((entry, i) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 bg-white/[0.05] rounded-xl px-3 py-2.5"
                    >
                      <span className="text-neutral-600 text-xs font-mono w-4 text-right shrink-0">
                        {i + 1}
                      </span>
                      <div className="size-8 rounded-lg bg-gradient-to-br from-red-500/30 to-amber-500/20 flex items-center justify-center shrink-0">
                        <Disc3 className="size-4 text-red-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-semibold truncate">
                          {entry.values.playerName || "Player"}
                        </p>
                        {entry.values.songName && (
                          <p className="text-white/40 text-xs truncate">
                            {entry.values.songName}
                            {entry.values.artistName &&
                              ` — ${entry.values.artistName}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Empty slots */}
                  {Array.from(
                    { length: Math.max(0, totalSlots - filledSlots) },
                    (_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="flex items-center gap-3 border border-dashed border-white/10 rounded-xl px-3 py-2.5"
                      >
                        <span className="text-neutral-700 text-xs font-mono w-4 text-right shrink-0">
                          {allEntries.length + i + 1}
                        </span>
                        <div className="size-8 rounded-lg bg-white/[0.03] flex items-center justify-center shrink-0">
                          <Music className="size-4 text-neutral-700" />
                        </div>
                        <p className="text-neutral-600 text-sm">
                          Awaiting submission
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* CTA */}
                {standaloneLists.map((list) => (
                  <Link
                    key={list.id}
                    href={`/${teamSlug}/${list.slug}`}
                    className="flex items-center justify-center gap-2 w-full bg-white text-neutral-900 font-bold text-sm py-3 rounded-xl hover:bg-neutral-100 transition-all active:scale-[0.98]"
                  >
                    Submit Your Song
                    <ArrowRight className="size-4" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">No song lists yet</p>
            )}
          </div>

          {/* ── Right: Events (light) ── */}
          <div className="bg-neutral-50 px-5 py-6 order-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">
              Upcoming Events
            </h2>

            {dateGroups.length > 0 ? (
              <div className="space-y-4">
                {dateGroups.map((group) => {
                  const allDone = group.lists.every(
                    (l) => getListStatus(l).level === "complete"
                  );
                  return (
                    <div
                      key={group.date}
                      className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm overflow-hidden"
                    >
                      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-900">
                          <Calendar className="size-3.5 text-neutral-400" />
                          {formatDate(group.date)}
                        </span>
                        <StatusBadge
                          level={allDone ? "complete" : "urgent"}
                        />
                      </div>
                      <div className="border-t border-neutral-100/80">
                        {group.lists.map((list, i) => {
                          const status = getListStatus(list);
                          return (
                            <Link
                              key={list.id}
                              href={`/${teamSlug}/${list.slug}`}
                              className={cn(
                                "flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50 transition-colors",
                                i < group.lists.length - 1 &&
                                  "border-b border-neutral-100/80"
                              )}
                            >
                              <span className="font-medium text-neutral-700 text-sm">
                                {list.name}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
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
                                <ChevronRight className="size-4 text-neutral-300" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-neutral-400 text-sm">No upcoming events</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
