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
  Disc3,
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
export default async function V1HeroSpotlight({
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
    l.entries.map((e) => ({ ...e, listSlug: l.slug, listName: l.name }))
  );

  return (
    <div className="min-h-dvh bg-neutral-100">
      <VariationNav current={1} teamSlug={teamSlug} />

      {/* Header */}
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-amber-900 via-amber-500 to-amber-900" />
        <div className="max-w-lg mx-auto px-4 py-5">
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            {team.name.toUpperCase()}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Coach {team.coachLastName} &middot; {team.seasonYear}
          </p>
        </div>
      </header>

      {/* ═══ HERO — Walk-Up Songs ═══ */}
      {standaloneLists.length > 0 && (
        <section className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-100 pt-2 pb-12">
          <div className="max-w-lg mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-red-500/10 to-neutral-900 ring-1 ring-white/10">
              {/* Decorative vinyl record */}
              <div className="absolute -right-16 -top-16 size-56 opacity-[0.07]">
                <div className="size-full rounded-full border-[16px] border-white">
                  <div className="size-full rounded-full border-4 border-white/50 flex items-center justify-center">
                    <div className="size-16 rounded-full border-4 border-white/80" />
                  </div>
                </div>
              </div>
              <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-amber-500/10 blur-3xl" />

              <div className="relative z-10 p-6">
                {/* Title row */}
                <div className="flex items-start gap-3 mb-5">
                  <div className="size-12 rounded-xl bg-amber-500/20 ring-1 ring-amber-400/20 flex items-center justify-center shrink-0">
                    <Mic2 className="size-6 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-heading text-3xl text-white tracking-tight leading-none">
                      WALK-UP SONGS
                    </h2>
                    <p className="text-amber-300/60 text-sm font-medium mt-1">
                      {filledSlots} of {totalSlots} players submitted
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${totalSlots > 0 ? (filledSlots / totalSlots) * 100 : 0}%`,
                    }}
                  />
                </div>

                {/* Song entries as playlist */}
                {allEntries.length > 0 && (
                  <div className="space-y-1.5 mb-6">
                    {allEntries.map((entry, i) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 bg-white/[0.06] hover:bg-white/[0.1] rounded-xl px-3 py-2.5 transition-colors group"
                      >
                        <span className="text-amber-500/60 text-xs font-mono w-5 text-right shrink-0">
                          {i + 1}
                        </span>
                        <div className="size-9 rounded-lg bg-gradient-to-br from-amber-500/30 to-red-500/20 flex items-center justify-center shrink-0">
                          <Disc3 className="size-4 text-amber-300" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-sm font-semibold truncate">
                            {entry.values.playerName || "Unknown Player"}
                          </p>
                          {entry.values.songName && (
                            <p className="text-white/40 text-xs truncate">
                              {entry.values.songName}
                              {entry.values.artistName &&
                                ` — ${entry.values.artistName}`}
                            </p>
                          )}
                        </div>
                        <Music className="size-3.5 text-white/20 group-hover:text-amber-400/60 transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty slots indicator */}
                {filledSlots < totalSlots && (
                  <p className="text-white/30 text-xs text-center mb-4">
                    {totalSlots - filledSlots} player
                    {totalSlots - filledSlots !== 1 && "s"} still need to submit
                  </p>
                )}

                {/* CTA */}
                {standaloneLists.map((list) => (
                  <Link
                    key={list.id}
                    href={`/${teamSlug}/${list.slug}`}
                    className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm py-3.5 rounded-xl transition-all active:scale-[0.98]"
                  >
                    Submit Your Walk-Up Song
                    <ArrowRight className="size-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Events ═══ */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
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
      </main>
    </div>
  );
}

/* ─── DateCard ─── */
function DateCard({
  group,
  teamSlug,
}: {
  group: DateGroup;
  teamSlug: string;
}) {
  const allDone = group.lists.every(
    (l) => getListStatus(l).level === "complete"
  );
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
        {group.lists.map((list, i) => {
          const status = getListStatus(list);
          return (
            <Link
              key={list.id}
              href={`/${teamSlug}/${list.slug}`}
              className={cn(
                "flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors",
                i < group.lists.length - 1 && "border-b border-neutral-100/80"
              )}
            >
              <span className="font-medium text-neutral-700 text-sm">
                {list.name}
              </span>
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
                <ChevronRight className="size-4 text-neutral-300" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
