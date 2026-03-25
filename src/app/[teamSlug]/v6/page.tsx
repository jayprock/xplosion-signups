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
  Play,
  Disc3,
  Radio,
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
export default async function V6MusicForward({
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
    <div className="min-h-dvh bg-neutral-950 text-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes eq-1 { 0%,100%{height:20%} 50%{height:80%} }
        @keyframes eq-2 { 0%,100%{height:50%} 50%{height:100%} }
        @keyframes eq-3 { 0%,100%{height:30%} 50%{height:90%} }
        @keyframes eq-4 { 0%,100%{height:60%} 50%{height:40%} }
        @keyframes eq-5 { 0%,100%{height:45%} 50%{height:75%} }
        .eq-1 { animation: eq-1 1.2s ease-in-out infinite; }
        .eq-2 { animation: eq-2 0.9s ease-in-out infinite; }
        .eq-3 { animation: eq-3 1.1s ease-in-out infinite; }
        .eq-4 { animation: eq-4 0.8s ease-in-out infinite; }
        .eq-5 { animation: eq-5 1.0s ease-in-out infinite; }
      `,
        }}
      />

      <VariationNav current={6} teamSlug={teamSlug} />

      {/* ═══ Dark Header ═══ */}
      <header className="border-b border-white/5">
        <div className="h-1 bg-gradient-to-r from-teal-900 via-teal-400 to-teal-900" />
        <div className="max-w-lg mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <Radio className="size-5 text-teal-400" />
            <div>
              <h1 className="font-heading text-4xl tracking-tight leading-none">
                {team.name.toUpperCase()}
              </h1>
              <p className="text-neutral-500 text-sm mt-0.5">
                Coach {team.coachLastName} &middot; {team.seasonYear}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* ═══ NOW PLAYING — Walk-Up Songs ═══ */}
        {standaloneLists.length > 0 && (
          <section>
            {/* Section header with equalizer */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-end gap-[3px] h-5">
                {["eq-1", "eq-2", "eq-3", "eq-4", "eq-5"].map((cls) => (
                  <div
                    key={cls}
                    className={cn(
                      "w-[3px] rounded-full bg-teal-400",
                      cls
                    )}
                  />
                ))}
              </div>
              <h2 className="font-heading text-xl tracking-tight text-teal-400 leading-none">
                NOW PLAYING
              </h2>
              <span className="text-neutral-600 text-xs ml-auto">
                {filledSlots}/{totalSlots} tracks
              </span>
            </div>

            {/* Playlist container */}
            <div className="bg-white/[0.03] rounded-2xl ring-1 ring-white/[0.06] overflow-hidden">
              {/* Playlist header row */}
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06] text-[10px] uppercase tracking-[0.15em] text-neutral-600">
                <span className="w-6 text-right">#</span>
                <span className="flex-1">Player</span>
                <span className="w-28 hidden sm:block">Song</span>
                <span className="w-20 hidden sm:block text-right">Artist</span>
              </div>

              {/* Tracks */}
              {allEntries.map((entry, i) => (
                <Link
                  key={entry.id}
                  href={`/${teamSlug}/${entry.listSlug}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors group",
                    i < allEntries.length - 1 &&
                      "border-b border-white/[0.03]"
                  )}
                >
                  {/* Track number / play icon */}
                  <span className="w-6 text-right text-neutral-600 text-sm group-hover:hidden">
                    {i + 1}
                  </span>
                  <Play className="size-4 text-teal-400 w-6 hidden group-hover:block" />

                  {/* Player name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {entry.values.playerName || "Player"}
                    </p>
                    {/* Song/artist on mobile */}
                    <p className="text-neutral-500 text-xs truncate sm:hidden">
                      {entry.values.songName || "—"}
                      {entry.values.artistName &&
                        ` · ${entry.values.artistName}`}
                    </p>
                  </div>

                  {/* Song — desktop */}
                  <span className="w-28 text-neutral-400 text-sm truncate hidden sm:block">
                    {entry.values.songName || "—"}
                  </span>

                  {/* Artist — desktop */}
                  <span className="w-20 text-neutral-500 text-sm truncate text-right hidden sm:block">
                    {entry.values.artistName || "—"}
                  </span>
                </Link>
              ))}

              {/* Empty track slots */}
              {Array.from(
                { length: Math.max(0, totalSlots - filledSlots) },
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3",
                      i < totalSlots - filledSlots - 1 &&
                        "border-b border-white/[0.03]"
                    )}
                  >
                    <span className="w-6 text-right text-neutral-700 text-sm">
                      {allEntries.length + i + 1}
                    </span>
                    <Disc3 className="size-4 text-neutral-800" />
                    <span className="text-neutral-700 text-sm italic">
                      Awaiting submission...
                    </span>
                  </div>
                )
              )}
            </div>

            {/* CTA */}
            {standaloneLists.map((list) => (
              <Link
                key={list.id}
                href={`/${teamSlug}/${list.slug}`}
                className="flex items-center justify-center gap-2 w-full bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-sm py-3.5 rounded-xl mt-4 transition-all active:scale-[0.98]"
              >
                Add Your Track
                <ArrowRight className="size-4" />
              </Link>
            ))}
          </section>
        )}

        {/* ═══ Upcoming Games ═══ */}
        {dateGroups.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-600 px-1">
              Upcoming Games
            </h2>
            {dateGroups.map((group) => {
              const allDone = group.lists.every(
                (l) => getListStatus(l).level === "complete"
              );
              return (
                <div
                  key={group.date}
                  className="bg-white/[0.03] rounded-2xl ring-1 ring-white/[0.06] overflow-hidden"
                >
                  <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-300">
                      <Calendar className="size-3.5 text-neutral-500" />
                      {formatDate(group.date)}
                    </span>
                    <StatusBadge level={allDone ? "complete" : "urgent"} />
                  </div>
                  <div className="border-t border-white/[0.04]">
                    {group.lists.map((list, i) => {
                      const status = getListStatus(list);
                      return (
                        <Link
                          key={list.id}
                          href={`/${teamSlug}/${list.slug}`}
                          className={cn(
                            "flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.03] transition-colors",
                            i < group.lists.length - 1 &&
                              "border-b border-white/[0.03]"
                          )}
                        >
                          <span className="font-medium text-neutral-400 text-sm">
                            {list.name}
                          </span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className={cn(
                                "text-sm tabular-nums font-medium",
                                status.level === "complete"
                                  ? "text-emerald-500"
                                  : "text-neutral-600"
                              )}
                            >
                              {status.filled}/{status.total}
                            </span>
                            <ChevronRight className="size-4 text-neutral-700" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
