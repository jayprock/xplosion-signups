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
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Music,
  Calendar,
  Shield,
  Pin,
} from "lucide-react";

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

export default async function V2Pinned({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = await getTeamBySlug(teamSlug);
  if (!team) notFound();

  const allLists = await getSignupListsForTeam(team.id);
  const today = new Date().toISOString().split("T")[0];
  const allDateGroups = groupListsByDate(allLists);
  const dateGroups = allDateGroups.filter((g) => g.date >= today);
  const pastDateGroups = [...allDateGroups.filter((g) => g.date < today)].reverse();
  const standaloneLists = getStandaloneLists(allLists);

  return (
    <div className="min-h-dvh bg-neutral-100">
      <VariationNav current={2} teamSlug={teamSlug} />

      {/* Header — identical to current dashboard */}
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

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* ── PINNED: Standalone lists moved above schedule ── */}
        {standaloneLists.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1 inline-flex items-center gap-1.5">
              <Pin className="size-3" />
              Pinned
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

        {/* Upcoming — identical to current dashboard */}
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

        {/* Past Events — collapsible via <details> */}
        {pastDateGroups.length > 0 && (
          <section>
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors px-1 py-2">
                <ChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180" />
                <span>
                  Show {pastDateGroups.length} past{" "}
                  {pastDateGroups.length === 1 ? "date" : "dates"}
                </span>
              </summary>
              <div className="space-y-4 mt-2 opacity-50">
                {pastDateGroups.map((group) => (
                  <DateCard
                    key={group.date}
                    group={group}
                    teamSlug={teamSlug}
                  />
                ))}
              </div>
            </details>
          </section>
        )}
      </main>
    </div>
  );
}

/* ─── DateCard — matches current dashboard exactly ─── */

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
                <FillDots filled={status.filled} total={status.total} />
                <ChevronRight className="size-4 text-neutral-300 group-hover/row:text-neutral-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FillDots({ filled, total }: { filled: number; total: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "size-2 rounded-full",
            i < filled ? "bg-neutral-900" : "bg-neutral-200"
          )}
        />
      ))}
    </div>
  );
}
