import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getTeamBySlug,
  getSignupListsForTeam,
  groupListsByEvent,
  getStandaloneLists,
  getListStatus,
} from "@/lib/data";
import type { SignupList } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Music,
} from "lucide-react";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getUrgencyConfig(level: string) {
  switch (level) {
    case "urgent":
      return {
        border: "border-l-red-500",
        badgeBg: "bg-red-500/15 text-red-400",
        barColor: "bg-red-500",
        label: "URGENT",
        pulse: true,
      };
    case "high":
      return {
        border: "border-l-orange-500",
        badgeBg: "bg-orange-500/15 text-orange-400",
        barColor: "bg-orange-500",
        label: "NEEDS HELP",
        pulse: false,
      };
    case "warning":
      return {
        border: "border-l-yellow-500",
        badgeBg: "bg-yellow-500/15 text-yellow-400",
        barColor: "bg-yellow-500",
        label: "COMING UP",
        pulse: false,
      };
    case "info":
      return {
        border: "border-l-zinc-500",
        badgeBg: "bg-zinc-500/15 text-zinc-400",
        barColor: "bg-zinc-500",
        label: "OPEN",
        pulse: false,
      };
    case "complete":
      return {
        border: "border-l-emerald-500",
        badgeBg: "bg-emerald-500/15 text-emerald-400",
        barColor: "bg-emerald-500",
        label: "FILLED",
        pulse: false,
      };
    default:
      return {
        border: "border-l-zinc-500",
        badgeBg: "bg-zinc-500/15 text-zinc-400",
        barColor: "bg-zinc-500",
        label: "OPEN",
        pulse: false,
      };
  }
}

function ListCard({
  list,
  teamSlug,
}: {
  list: SignupList;
  teamSlug: string;
}) {
  const status = getListStatus(list);
  const config = getUrgencyConfig(status.level);
  const pct =
    status.total > 0 ? (status.filled / status.total) * 100 : 0;

  return (
    <Link href={`/t/${teamSlug}/${list.slug}`} className="block">
      <div
        className={`border-l-[3px] ${config.border} rounded-lg bg-card p-3.5 transition-all hover:bg-card/80 active:scale-[0.99] ${
          config.pulse ? "animate-pulse-subtle" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">{list.name}</span>
          <div className="flex items-center gap-2">
            <Badge
              className={`${config.badgeBg} border-0 text-[10px] font-bold tracking-wider`}
            >
              {config.label}
            </Badge>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full ${config.barColor} transition-all`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {status.filled}/{status.total}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function TeamDashboardPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);
  if (!team) return notFound();

  const allLists = getSignupListsForTeam(team.id);
  const eventGroups = groupListsByEvent(allLists);
  const standalone = getStandaloneLists(allLists);

  return (
    <div className="min-h-svh">
      {/* Hero header */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />
        <div className="relative px-5 py-8 max-w-lg mx-auto">
          <p className="text-[11px] tracking-[0.25em] uppercase text-primary font-semibold mb-1">
            {team.seasonYear} Season
          </p>
          <h1 className="font-display text-4xl tracking-tight text-foreground">
            {team.name.toUpperCase()}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Coach {team.coachLastName}
          </p>
        </div>
      </header>

      <main className="px-5 py-6 max-w-lg mx-auto space-y-8">
        {/* Event groups */}
        {eventGroups.map((group, gi) => (
          <section
            key={`${group.date}-${group.opponent}`}
            className="animate-fade-up"
            style={{ animationDelay: `${gi * 80}ms` }}
          >
            {/* Event header */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-xl tracking-tight text-foreground">
                  VS {group.opponent?.toUpperCase()}
                </h2>
                {group.isHome && (
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-primary/15 text-primary px-1.5 py-0.5 rounded">
                    HOME
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formatDate(group.date)}
                </span>
                {group.time && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {group.time}
                  </span>
                )}
                {group.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" />
                    {group.location}
                  </span>
                )}
              </div>
            </div>

            {/* Duty cards */}
            <div className="space-y-2">
              {group.lists.map((list) => (
                <ListCard
                  key={list.id}
                  list={list}
                  teamSlug={teamSlug}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Standalone lists */}
        {standalone.length > 0 && (
          <section
            className="animate-fade-up"
            style={{ animationDelay: `${eventGroups.length * 80}ms` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Music className="size-4 text-primary" />
              <h2 className="font-display text-xl tracking-tight text-foreground">
                PLAYLISTS
              </h2>
            </div>
            <div className="space-y-2">
              {standalone.map((list) => {
                const status = getListStatus(list);
                const pct =
                  status.total > 0
                    ? (status.filled / status.total) * 100
                    : 0;

                return (
                  <Link
                    key={list.id}
                    href={`/t/${teamSlug}/${list.slug}`}
                    className="block"
                  >
                    <div className="border-l-[3px] border-l-primary/50 rounded-lg bg-card p-3.5 transition-all hover:bg-card/80 active:scale-[0.99]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">
                          {list.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {status.filled}/{status.total} submitted
                          </span>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
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
