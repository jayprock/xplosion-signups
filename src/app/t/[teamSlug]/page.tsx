import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Music,
  Shield,
} from "lucide-react";
import {
  getTeamBySlug,
  getSignupListsForTeam,
  getListStatus,
  groupListsByEvent,
  getStandaloneLists,
} from "@/lib/data";
import type { UrgencyLevel } from "@/lib/types";

function urgencyConfig(level: UrgencyLevel) {
  switch (level) {
    case "urgent":
      return {
        label: "This Week",
        dotClass: "bg-[oklch(0.62_0.23_25)]",
        borderClass: "border-[oklch(0.62_0.23_25_/_0.3)]",
        bgClass: "bg-[oklch(0.62_0.23_25_/_0.06)]",
        textClass: "text-[oklch(0.68_0.20_25)]",
        badgeClass:
          "bg-[oklch(0.62_0.23_25_/_0.15)] text-[oklch(0.70_0.20_25)]",
        pulse: true,
      };
    case "high":
      return {
        label: "2 Weeks",
        dotClass: "bg-[oklch(0.73_0.17_55)]",
        borderClass: "border-[oklch(0.73_0.17_55_/_0.25)]",
        bgClass: "bg-[oklch(0.73_0.17_55_/_0.04)]",
        textClass: "text-[oklch(0.76_0.15_55)]",
        badgeClass:
          "bg-[oklch(0.73_0.17_55_/_0.12)] text-[oklch(0.78_0.14_55)]",
        pulse: false,
      };
    case "warning":
      return {
        label: "3 Weeks",
        dotClass: "bg-[oklch(0.82_0.15_85)]",
        borderClass: "border-[oklch(0.82_0.15_85_/_0.2)]",
        bgClass: "bg-[oklch(0.82_0.15_85_/_0.03)]",
        textClass: "text-[oklch(0.84_0.12_85)]",
        badgeClass:
          "bg-[oklch(0.82_0.15_85_/_0.10)] text-[oklch(0.85_0.12_85)]",
        pulse: false,
      };
    case "info":
      return {
        label: "Upcoming",
        dotClass: "bg-[oklch(0.45_0_0)]",
        borderClass: "border-[oklch(1_0_0_/_0.08)]",
        bgClass: "bg-transparent",
        textClass: "text-[oklch(0.55_0_0)]",
        badgeClass: "bg-[oklch(1_0_0_/_0.06)] text-[oklch(0.55_0_0)]",
        pulse: false,
      };
    case "complete":
      return {
        label: "Filled",
        dotClass: "bg-[oklch(0.65_0.19_145)]",
        borderClass: "border-[oklch(0.65_0.19_145_/_0.2)]",
        bgClass: "bg-[oklch(0.65_0.19_145_/_0.04)]",
        textClass: "text-[oklch(0.70_0.16_145)]",
        badgeClass:
          "bg-[oklch(0.65_0.19_145_/_0.12)] text-[oklch(0.72_0.15_145)]",
        pulse: false,
      };
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();

  let relative = "";
  if (diffDays === 0) relative = "Today";
  else if (diffDays === 1) relative = "Tomorrow";
  else if (diffDays <= 7) relative = `In ${diffDays} days`;
  else {
    const weeks = Math.floor(diffDays / 7);
    relative = `In ${weeks}${diffDays % 7 > 0 ? "+" : ""} week${weeks > 1 ? "s" : ""}`;
  }

  return { dayName, month, day, relative };
}

export default async function TeamDashboardPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);

  if (!team) notFound();

  const allLists = getSignupListsForTeam(team.id);
  const eventGroups = groupListsByEvent(allLists);
  const standaloneLists = getStandaloneLists(allLists);

  return (
    <div className="min-h-dvh bg-[oklch(0.08_0_0)]">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[oklch(0.58_0.23_25)] via-[oklch(0.65_0.20_30)] to-[oklch(0.58_0.23_25)]" />

      {/* Header */}
      <header className="border-b border-[oklch(1_0_0_/_0.06)] bg-[oklch(0.10_0_0)]">
        <div className="mx-auto max-w-lg px-4 py-4">
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-1 text-xs font-700 uppercase tracking-widest text-[oklch(0.40_0_0)] transition-colors hover:text-[oklch(0.60_0_0)]"
          >
            <ArrowLeft className="h-3 w-3" />
            Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[oklch(0.58_0.23_25)] shadow-[0_0_20px_oklch(0.58_0.23_25_/_0.2)]">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-xl font-900 uppercase tracking-tight text-white">
                {team.name}
              </h1>
              <p className="text-xs font-600 text-[oklch(0.45_0_0)]">
                Coach {team.coachLastName} &middot; {team.seasonYear} Season
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {/* Event-tied lists grouped by game */}
        {eventGroups.map((group, gi) => {
          const { dayName, month, day, relative } = formatDate(group.date);

          // Determine worst urgency in this group for the section accent
          const statuses = group.lists.map((l) => getListStatus(l));
          const worstLevel = statuses.reduce<UrgencyLevel>((worst, s) => {
            const priority: UrgencyLevel[] = [
              "urgent",
              "high",
              "warning",
              "info",
              "complete",
            ];
            return priority.indexOf(s.level) < priority.indexOf(worst)
              ? s.level
              : worst;
          }, "complete");

          const sectionConfig = urgencyConfig(worstLevel);

          return (
            <section
              key={`${group.date}-${group.opponent}`}
              className={`mb-6 animate-slide-up-fade`}
              style={{ animationDelay: `${gi * 0.08}s` }}
            >
              {/* Game header */}
              <div className="mb-3 flex items-center gap-3">
                {/* Date block */}
                <div
                  className={`flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg border ${sectionConfig.borderClass} ${sectionConfig.bgClass}`}
                >
                  <span
                    className={`text-[10px] font-800 uppercase ${sectionConfig.textClass}`}
                  >
                    {dayName}
                  </span>
                  <span className="text-lg font-900 leading-none text-white">
                    {day}
                  </span>
                  <span className="text-[10px] font-700 uppercase text-[oklch(0.45_0_0)]">
                    {month}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-800 text-white">
                      {group.isHome ? "vs" : "@"} {group.opponent}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-800 uppercase tracking-wider ${sectionConfig.badgeClass}`}
                    >
                      {relative}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] font-600 text-[oklch(0.40_0_0)]">
                    {group.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {group.time}
                      </span>
                    )}
                    {group.location && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {group.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Duty cards */}
              <div className="grid grid-cols-2 gap-2">
                {group.lists.map((list) => {
                  const status = getListStatus(list);
                  const config = urgencyConfig(status.level);

                  return (
                    <Link
                      key={list.id}
                      href={`/t/${teamSlug}/${list.slug}`}
                      className={`group relative flex flex-col rounded-lg border ${config.borderClass} ${config.bgClass} bg-[oklch(0.12_0_0)] p-3 transition-all hover:bg-[oklch(0.14_0_0)]`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-700 text-white">
                          {list.name}
                        </p>
                        <ChevronRight className="h-3.5 w-3.5 text-[oklch(0.30_0_0)] transition-colors group-hover:text-[oklch(0.50_0_0)]" />
                      </div>
                      <div className="mt-auto pt-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${config.dotClass} ${config.pulse ? "animate-pulse-red" : ""}`}
                          />
                          <span
                            className={`text-xs font-700 ${config.textClass}`}
                          >
                            {status.filled}/{status.total}
                          </span>
                          <span className="text-[10px] font-600 text-[oklch(0.35_0_0)]">
                            filled
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[oklch(1_0_0_/_0.06)]">
                          <div
                            className={`h-full rounded-full ${config.dotClass} transition-all`}
                            style={{
                              width: `${(status.filled / status.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Standalone lists */}
        {standaloneLists.length > 0 && (
          <section className="mt-8 animate-slide-up-fade stagger-4">
            <div className="mb-3 flex items-center gap-2">
              <Music className="h-4 w-4 text-[oklch(0.58_0.23_25)]" />
              <h2 className="font-[family-name:var(--font-display)] text-sm font-800 uppercase tracking-wider text-[oklch(0.50_0_0)]">
                Walk-Up Songs
              </h2>
            </div>

            <div className="space-y-2">
              {standaloneLists.map((list) => {
                const status = getListStatus(list);
                const config = urgencyConfig(status.level);

                return (
                  <Link
                    key={list.id}
                    href={`/t/${teamSlug}/${list.slug}`}
                    className={`group flex items-center gap-3 rounded-lg border ${config.borderClass} bg-[oklch(0.12_0_0)] p-4 transition-all hover:bg-[oklch(0.14_0_0)]`}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[oklch(0.58_0.23_25_/_0.1)]">
                      <Music className="h-5 w-5 text-[oklch(0.62_0.23_25)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-700 text-white">{list.name}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${config.dotClass}`}
                        />
                        <span className="text-xs font-600 text-[oklch(0.45_0_0)]">
                          {status.filled} of {status.total} players submitted
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[oklch(0.30_0_0)] transition-colors group-hover:text-[oklch(0.50_0_0)]" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
