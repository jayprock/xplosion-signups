import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getTeamBySlug,
  getSignupListsForTeam,
  getListStatus,
  groupListsByEvent,
  getStandaloneLists,
} from "@/lib/data";
import type { EventGroup } from "@/lib/data";
import type { SignupList, UrgencyLevel, ListStatus as ListStatusType } from "@/lib/types";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  ArrowLeft,
  Music,
  AlertCircle,
  CheckCircle2,
  Swords,
} from "lucide-react";

function urgencyConfig(level: UrgencyLevel) {
  switch (level) {
    case "urgent":
      return {
        label: "This Week",
        dotClass: "bg-urgent",
        textClass: "text-urgent",
        bgClass: "bg-urgent/10",
        borderClass: "border-urgent/30",
        ringClass: "ring-urgent/20",
      };
    case "high":
      return {
        label: "2 Weeks",
        dotClass: "bg-high",
        textClass: "text-high",
        bgClass: "bg-high/10",
        borderClass: "border-high/30",
        ringClass: "ring-high/20",
      };
    case "warning":
      return {
        label: "3 Weeks",
        dotClass: "bg-warning",
        textClass: "text-warning",
        bgClass: "bg-warning/10",
        borderClass: "border-warning/30",
        ringClass: "ring-warning/20",
      };
    case "info":
      return {
        label: "Upcoming",
        dotClass: "bg-muted-foreground",
        textClass: "text-muted-foreground",
        bgClass: "bg-muted",
        borderClass: "border-border",
        ringClass: "ring-border",
      };
    case "complete":
      return {
        label: "Filled",
        dotClass: "bg-complete",
        textClass: "text-complete",
        bgClass: "bg-complete/10",
        borderClass: "border-complete/30",
        ringClass: "ring-complete/20",
      };
  }
}

function StatusPill({ status }: { status: ListStatusType }) {
  const config = urgencyConfig(status.level);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${config.bgClass} ${config.textClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {status.filled}/{status.total}
    </span>
  );
}

function EventCard({
  group,
  teamSlug,
}: {
  group: EventGroup;
  teamSlug: string;
}) {
  const eventDate = new Date(group.date);
  const dayName = eventDate.toLocaleDateString("en-US", { weekday: "short" });
  const monthDay = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Get the worst urgency across all lists in this event
  const statuses = group.lists.map((l) => getListStatus(l));
  const worstLevel = getWorstUrgency(statuses.map((s) => s.level));
  const config = urgencyConfig(worstLevel);

  return (
    <div
      className={`rounded-xl border bg-card overflow-hidden ring-1 ${config.ringClass} ${config.borderClass} transition-all`}
    >
      {/* Event header */}
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        {/* Date block */}
        <div
          className={`flex-shrink-0 w-12 h-14 rounded-lg flex flex-col items-center justify-center ${config.bgClass}`}
        >
          <span className={`text-[10px] font-bold uppercase ${config.textClass}`}>
            {dayName}
          </span>
          <span className={`text-lg font-bold leading-tight ${config.textClass}`}>
            {eventDate.getDate()}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Swords className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="font-semibold text-sm truncate">
              vs {group.opponent}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            {group.time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {group.time}
              </span>
            )}
            {group.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {group.location}
              </span>
            )}
          </div>
          <div className="mt-1">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${config.textClass}`}
            >
              {group.isHome ? "Home" : "Away"}
            </span>
          </div>
        </div>
      </div>

      {/* Duty list items */}
      <div className="border-t border-border/50">
        {group.lists.map((list) => {
          const status = getListStatus(list);
          return (
            <ListRow
              key={list.id}
              list={list}
              status={status}
              teamSlug={teamSlug}
            />
          );
        })}
      </div>
    </div>
  );
}

function ListRow({
  list,
  status,
  teamSlug,
}: {
  list: SignupList;
  status: ListStatusType;
  teamSlug: string;
}) {
  const config = urgencyConfig(status.level);
  const isFull = status.level === "complete";

  return (
    <Link
      href={`/t/${teamSlug}/${list.slug}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border/30 last:border-b-0 group"
    >
      {/* Status indicator */}
      <div className="flex-shrink-0">
        {isFull ? (
          <CheckCircle2 className="w-4 h-4 text-complete" />
        ) : (
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              status.level === "urgent"
                ? "border-urgent"
                : status.level === "high"
                  ? "border-high"
                  : status.level === "warning"
                    ? "border-warning"
                    : "border-muted-foreground/40"
            }`}
          >
            {status.level === "urgent" && (
              <div className="w-1.5 h-1.5 rounded-full bg-urgent" />
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span
          className={`text-sm font-medium ${isFull ? "text-muted-foreground" : ""}`}
        >
          {list.name}
        </span>
      </div>

      <StatusPill status={status} />

      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors flex-shrink-0" />
    </Link>
  );
}

function StandaloneCard({
  list,
  teamSlug,
}: {
  list: SignupList;
  teamSlug: string;
}) {
  const status = getListStatus(list);
  const config = urgencyConfig(status.level);

  return (
    <Link
      href={`/t/${teamSlug}/${list.slug}`}
      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors group ring-1 ring-border/50"
    >
      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
        <Music className="w-5 h-5 text-team-red" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{list.name}</div>
        <div className="text-xs text-muted-foreground">
          {status.filled} of {status.total} players submitted
        </div>
      </div>
      <StatusPill status={status} />
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors flex-shrink-0" />
    </Link>
  );
}

function getWorstUrgency(levels: UrgencyLevel[]): UrgencyLevel {
  const priority: UrgencyLevel[] = [
    "urgent",
    "high",
    "warning",
    "info",
    "complete",
  ];
  for (const p of priority) {
    if (levels.includes(p)) return p;
  }
  return "info";
}

export default async function TeamDashboardPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);

  if (!team) {
    notFound();
  }

  const allLists = getSignupListsForTeam(team.id);
  const eventGroups = groupListsByEvent(allLists);
  const standaloneLists = getStandaloneLists(allLists);

  // Count needs-attention items
  const needsAttention = allLists.filter((l) => {
    const s = getListStatus(l);
    return s.level === "urgent" || s.level === "high";
  }).length;

  return (
    <div className="min-h-dvh bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 h-12 flex items-center gap-3">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-sm truncate">{team.name}</span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {team.seasonYear}
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-8">
        {/* Team hero */}
        <div className="pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-team-red flex items-center justify-center shadow-lg shadow-team-red/20">
              <span className="text-white text-lg font-bold tracking-tighter">
                {team.name
                  .split(" ")
                  .pop()
                  ?.charAt(0) || "T"}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{team.name}</h1>
              <p className="text-xs text-muted-foreground">
                Coach {team.coachLastName} &middot; {team.seasonYear} Season
              </p>
            </div>
          </div>

          {needsAttention > 0 && (
            <div
              className="mt-4 flex items-center gap-2 rounded-lg bg-urgent/10 border border-urgent/20 px-3 py-2 animate-slide-up"
            >
              <AlertCircle className="w-4 h-4 text-urgent flex-shrink-0" />
              <span className="text-xs text-urgent font-medium">
                {needsAttention} {needsAttention === 1 ? "list needs" : "lists need"}{" "}
                volunteers soon
              </span>
            </div>
          )}
        </div>

        {/* Game Events */}
        {eventGroups.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Upcoming Games
              </h2>
            </div>
            <div className="space-y-3">
              {eventGroups.map((group, i) => (
                <div
                  key={`${group.date}-${group.opponent}`}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <EventCard group={group} teamSlug={teamSlug} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Standalone Lists */}
        {standaloneLists.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Music className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Walk-Up Songs
              </h2>
            </div>
            <div className="space-y-2">
              {standaloneLists.map((list, i) => (
                <div
                  key={list.id}
                  className="animate-slide-up"
                  style={{
                    animationDelay: `${(eventGroups.length + i) * 0.05}s`,
                  }}
                >
                  <StandaloneCard list={list} teamSlug={teamSlug} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
