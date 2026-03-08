import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getTeamBySlug,
  getSignupListBySlug,
  getListStatus,
} from "@/lib/data";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { EventSignupList } from "@/components/event-signup-list";
import { WalkupSongList } from "@/components/walkup-song-list";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function SignupListPage({
  params,
}: {
  params: Promise<{ teamSlug: string; listSlug: string }>;
}) {
  const { teamSlug, listSlug } = await params;
  const team = getTeamBySlug(teamSlug);
  if (!team) return notFound();

  const list = getSignupListBySlug(team.id, listSlug);
  if (!list) return notFound();

  const status = getListStatus(list);
  const pct =
    status.total > 0 ? (status.filled / status.total) * 100 : 0;

  return (
    <div className="min-h-svh">
      {/* Header */}
      <header className="border-b border-border">
        <div className="px-5 py-5 max-w-lg mx-auto">
          <Link
            href={`/t/${teamSlug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            {team.name}
          </Link>

          <h1 className="font-display text-3xl tracking-tight text-foreground">
            {list.name.toUpperCase()}
          </h1>

          {/* Event details */}
          {list.event && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(list.event.date)}
              </span>
              {list.event.time && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {list.event.time}
                </span>
              )}
              {list.event.opponent && (
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3" />
                  vs {list.event.opponent}
                </span>
              )}
              {list.event.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" />
                  {list.event.location}
                </span>
              )}
            </div>
          )}

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  status.level === "complete"
                    ? "bg-emerald-500"
                    : "bg-primary"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {status.filled} of {status.total}
            </span>
          </div>
        </div>
      </header>

      <main className="px-5 py-6 max-w-lg mx-auto">
        {list.category === "event-tied" ? (
          <EventSignupList list={list} />
        ) : (
          <WalkupSongList list={list} />
        )}
      </main>
    </div>
  );
}
