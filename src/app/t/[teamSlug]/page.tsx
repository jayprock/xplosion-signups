import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getTeamBySlug,
  getSignupListsForTeam,
  getListStatus,
  groupListsByEvent,
  getStandaloneLists,
  type EventGroup,
} from "@/lib/data";
import type { SignupList, ListStatus, UrgencyLevel } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  CalendarDays,
  MapPin,
  Clock,
  ChevronRight,
  Music,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Info,
} from "lucide-react";

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
    <div className="min-h-screen relative">
      <div className="absolute inset-0 stripe-pattern" />

      {/* Header with team info */}
      <header className="relative z-10 slant-bottom bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 pb-16 pt-6 px-5">
        <div className="max-w-lg mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs font-medium tracking-wide uppercase mb-6 transition-colors"
          >
            <div className="w-6 h-6 bg-xred rounded-sm flex items-center justify-center -skew-x-6">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span>Xplosion</span>
          </Link>

          <div className="animate-slide-up">
            <p className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-xred mb-2">
              {team.seasonYear} Season
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
              {team.name}
            </h1>
            <p className="text-sm text-zinc-400">
              Coach {team.coachLastName}
            </p>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="relative z-10 px-5 -mt-6 pb-12">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Event-tied lists grouped by game */}
          {eventGroups.map((group, gi) => (
            <EventGroupSection
              key={`${group.date}-${group.opponent}`}
              group={group}
              teamSlug={teamSlug}
              index={gi}
            />
          ))}

          {/* Standalone lists */}
          {standaloneLists.length > 0 && (
            <section
              className="animate-slide-up"
              style={{ animationDelay: `${(eventGroups.length + 1) * 0.08}s` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-4 h-4 text-xred" />
                <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-400">
                  Playlists
                </h2>
              </div>
              <div className="space-y-3">
                {standaloneLists.map((list) => (
                  <ListCard
                    key={list.id}
                    list={list}
                    teamSlug={teamSlug}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function EventGroupSection({
  group,
  teamSlug,
  index,
}: {
  group: EventGroup;
  teamSlug: string;
  index: number;
}) {
  const eventDate = new Date(group.date + "T00:00:00");
  const dayOfWeek = eventDate.toLocaleDateString("en-US", { weekday: "short" });
  const month = eventDate.toLocaleDateString("en-US", { month: "short" });
  const day = eventDate.getDate();

  return (
    <section
      className="animate-slide-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Game header */}
      <div className="flex items-start gap-4 mb-3">
        {/* Date block */}
        <div className="flex-shrink-0 w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col items-center justify-center -skew-x-3">
          <span className="text-[0.6rem] font-bold uppercase text-xred leading-none">
            {dayOfWeek}
          </span>
          <span className="text-lg font-extrabold text-white leading-tight">
            {day}
          </span>
          <span className="text-[0.55rem] font-medium uppercase text-zinc-500 leading-none">
            {month}
          </span>
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <h2 className="text-base font-bold text-white truncate">
            {group.isHome ? "vs" : "@"} {group.opponent}
          </h2>
          <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
            {group.time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {group.time}
              </span>
            )}
            {group.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3" />
                {group.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* List cards for this event */}
      <div className="space-y-2 ml-0">
        {group.lists.map((list) => (
          <ListCard key={list.id} list={list} teamSlug={teamSlug} />
        ))}
      </div>
    </section>
  );
}

function ListCard({
  list,
  teamSlug,
}: {
  list: SignupList;
  teamSlug: string;
}) {
  const status = getListStatus(list);

  return (
    <Link href={`/t/${teamSlug}/${list.slug}`}>
      <Card className="group p-0 bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/90 transition-all cursor-pointer">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Status indicator */}
          <StatusDot level={status.level} />

          {/* List info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
              {list.name}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {status.filled} of {status.total} filled
            </p>
          </div>

          {/* Status badge */}
          <StatusBadge status={status} />

          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
        </div>
      </Card>
    </Link>
  );
}

function StatusDot({ level }: { level: UrgencyLevel }) {
  const config: Record<UrgencyLevel, { color: string; pulse: boolean }> = {
    urgent: { color: "bg-red-500", pulse: true },
    high: { color: "bg-orange-500", pulse: false },
    warning: { color: "bg-yellow-500", pulse: false },
    info: { color: "bg-zinc-500", pulse: false },
    complete: { color: "bg-emerald-500", pulse: false },
  };
  const c = config[level];

  return (
    <div className="relative flex-shrink-0">
      <div className={`w-2.5 h-2.5 rounded-full ${c.color} ${c.pulse ? "urgency-pulse" : ""}`} />
      {c.pulse && (
        <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${c.color} opacity-40 animate-ping`} />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ListStatus }) {
  const config: Record<
    UrgencyLevel,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    urgent: {
      label: "Urgent",
      className: "bg-red-500/15 text-red-400 border-red-500/20",
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    high: {
      label: "Soon",
      className: "bg-orange-500/15 text-orange-400 border-orange-500/20",
      icon: <CircleDot className="w-3 h-3" />,
    },
    warning: {
      label: "Open",
      className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      icon: <Info className="w-3 h-3" />,
    },
    info: {
      label: "Open",
      className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      icon: <Info className="w-3 h-3" />,
    },
    complete: {
      label: "Done",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
  };

  const c = config[status.level];

  return (
    <Badge
      variant="outline"
      className={`text-[0.65rem] font-semibold gap-1 px-2 py-0.5 ${c.className}`}
    >
      {c.icon}
      {c.label}
    </Badge>
  );
}
