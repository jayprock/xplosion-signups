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
  ArrowLeft,
  Shield,
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

function getEntryDisplayName(
  entry: import("@/lib/types").SignupEntry,
  list: SignupList
): string | null {
  const nameField =
    list.fields.find((f) => f.key === "name") ??
    list.fields.find((f) => f.required);
  if (!nameField) return null;
  const val = entry.values[nameField.key];
  return val?.trim() || null;
}

/* ─── Page ─── */
export default async function V2StickyBar({
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
  const isComplete = filledSlots >= totalSlots;
  const firstList = standaloneLists[0];

  return (
    <div className="min-h-dvh bg-neutral-100">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes bar-bounce {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
        .eq-bar { animation: bar-bounce 0.8s ease-in-out infinite; }
        .eq-bar:nth-child(2) { animation-delay: 0.15s; }
        .eq-bar:nth-child(3) { animation-delay: 0.3s; }
        .eq-bar:nth-child(4) { animation-delay: 0.1s; }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
          50% { box-shadow: 0 0 20px 4px rgba(245, 158, 11, 0.15); }
        }
        .glow-pulse { animation: glow-pulse 2.5s ease-in-out infinite; }
      `,
        }}
      />

      <VariationNav current={2} teamSlug={teamSlug} />

      {/* Header */}
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm mb-3"
          >
            <ArrowLeft className="size-3.5" />
            Home
          </Link>
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            {team.name.toUpperCase()}
          </h1>
          <div className="flex items-center justify-between mt-1">
            <p className="text-neutral-500 text-sm">
              Coach {team.coachLastName} &middot; {team.seasonYear}
            </p>
            <Link
              href={`/${teamSlug}/admin`}
              className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-white text-xs font-medium transition-colors"
            >
              <Shield className="size-3" />
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main content — same layout as original, padded for floating bar */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-8 pb-28">
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

        {standaloneLists.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
              Team Lists
            </h2>
            {standaloneLists.map((list) => {
              const status = getListStatus(list);
              return (
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
                        {status.filled} of {status.total} submitted
                      </p>
                    </div>
                    <ChevronRight className="size-5 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0" />
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </main>

      {/* ═══ FLOATING BAR ═══ */}
      {standaloneLists.length > 0 && firstList && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 pb-4">
          <div className="max-w-lg mx-auto">
            <Link
              href={`/${teamSlug}/${firstList.slug}`}
              className={cn(
                "flex items-center gap-3 bg-neutral-950/85 backdrop-blur-xl rounded-2xl px-4 py-3.5 ring-1 ring-white/10 transition-all hover:ring-white/20 hover:bg-neutral-950/90 active:scale-[0.99]",
                !isComplete && "glow-pulse"
              )}
            >
              {/* Equalizer icon */}
              <div className="size-11 rounded-xl bg-amber-500/20 flex items-center justify-end gap-[3px] px-2.5 shrink-0">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="eq-bar w-[3px] rounded-full bg-amber-400"
                    style={isComplete ? { animation: "none", height: "60%" } : undefined}
                  />
                ))}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">
                  Walk-Up Songs
                </p>
                <p className="text-white/50 text-xs">
                  {isComplete
                    ? "All submitted!"
                    : `${filledSlots} of ${totalSlots} submitted`}
                </p>
              </div>

              {/* Progress ring */}
              <div className="relative size-10 shrink-0">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke={isComplete ? "#10b981" : "#f59e0b"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 14}
                    strokeDashoffset={
                      2 * Math.PI * 14 * (1 - (totalSlots > 0 ? filledSlots / totalSlots : 0))
                    }
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                  {totalSlots > 0
                    ? Math.round((filledSlots / totalSlots) * 100)
                    : 0}
                  %
                </span>
              </div>

              <ArrowRight className="size-4 text-white/40 shrink-0" />
            </Link>
          </div>
        </div>
      )}
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
          const names = list.entries
            .map((e) => getEntryDisplayName(e, list))
            .filter(Boolean) as string[];
          return (
            <Link
              key={list.id}
              href={`/${teamSlug}/${list.slug}`}
              className={cn(
                "flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors group/row",
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
                {names.length > 0 && (
                  <p className="text-xs text-neutral-400 mt-0.5 truncate">
                    {names.join(", ")}
                  </p>
                )}
              </div>
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
                <ChevronRight className="size-4 text-neutral-300 group-hover/row:text-neutral-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
