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
import type { SignupList, SignupEntry } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import {
  ChevronRight,
  Music,
  Calendar,
  Check,
  Clock,
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

/* ─── Progress Ring ─── */
function ProgressRing({
  filled,
  total,
}: {
  filled: number;
  total: number;
}) {
  const pct = total > 0 ? filled / total : 0;
  const r = 68;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);
  const isComplete = pct >= 1;

  return (
    <div className="relative size-52 mx-auto">
      <svg className="size-full -rotate-90" viewBox="0 0 160 160">
        {/* Background track */}
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke={isComplete ? "#10b981" : "#f59e0b"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-6xl tracking-tight text-neutral-900 leading-none">
          {Math.round(pct * 100)}%
        </span>
        <span className="text-neutral-400 text-sm font-medium mt-1">
          {filled} of {total} submitted
        </span>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default async function V7Progress({
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

  // Build player cards: filled entries + empty placeholders
  type PlayerCard = {
    filled: boolean;
    playerName: string;
    songName?: string;
    artistName?: string;
    listSlug: string;
  };
  const playerCards: PlayerCard[] = [];
  for (const list of standaloneLists) {
    for (const entry of list.entries) {
      playerCards.push({
        filled: true,
        playerName: entry.values.playerName || "Player",
        songName: entry.values.songName,
        artistName: entry.values.artistName,
        listSlug: list.slug,
      });
    }
    const remaining = list.slotsNeeded - list.entries.length;
    for (let i = 0; i < remaining; i++) {
      playerCards.push({
        filled: false,
        playerName: "Awaiting",
        listSlug: list.slug,
      });
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-50">
      <VariationNav current={7} teamSlug={teamSlug} />

      {/* Header */}
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-emerald-900 via-amber-500 to-emerald-900" />
        <div className="max-w-lg mx-auto px-4 py-5">
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            {team.name.toUpperCase()}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Coach {team.coachLastName} &middot; {team.seasonYear}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-8">
        {/* ═══ Progress Ring ═══ */}
        {standaloneLists.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1 text-center">
              Walk-Up Song Progress
            </h2>
            <ProgressRing filled={filledSlots} total={totalSlots} />

            {/* CTA */}
            {standaloneLists.map((list) => (
              <Link
                key={list.id}
                href={`/${teamSlug}/${list.slug}`}
                className="flex items-center justify-center gap-2 w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-[0.98]"
              >
                {filledSlots >= totalSlots
                  ? "View All Songs"
                  : "Submit Your Song"}
                <ArrowRight className="size-4" />
              </Link>
            ))}
          </section>
        )}

        {/* ═══ Player Cards Grid ═══ */}
        {playerCards.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
              Players
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {playerCards.map((card, i) => (
                <Link
                  key={i}
                  href={`/${teamSlug}/${card.listSlug}`}
                  className={cn(
                    "rounded-xl p-3.5 transition-all active:scale-[0.98]",
                    card.filled
                      ? "bg-white ring-1 ring-black/[0.04] shadow-sm hover:shadow-md"
                      : "bg-neutral-100 ring-1 ring-neutral-200/60 hover:bg-neutral-50"
                  )}
                >
                  {card.filled ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Check className="size-3 text-emerald-600" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600">
                          Submitted
                        </span>
                      </div>
                      <p className="font-semibold text-neutral-900 text-sm truncate">
                        {card.playerName}
                      </p>
                      {card.songName && (
                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                          {card.songName}
                        </p>
                      )}
                      {card.artistName && (
                        <p className="text-xs text-neutral-400 truncate">
                          {card.artistName}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-5 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                          <Clock className="size-3 text-neutral-400" />
                        </div>
                        <span className="text-xs font-semibold text-neutral-400">
                          Pending
                        </span>
                      </div>
                      <p className="font-semibold text-neutral-300 text-sm">
                        Awaiting
                      </p>
                      <p className="text-xs text-neutral-300 mt-0.5">
                        Not yet submitted
                      </p>
                    </>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ Events ═══ */}
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
