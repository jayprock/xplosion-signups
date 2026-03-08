import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Home,
  Plane,
} from "lucide-react";
import {
  getTeamBySlug,
  getSignupListBySlug,
  getListStatus,
} from "@/lib/data";
import { EventSlotForm } from "./event-slot-form";
import { WalkupSongForm } from "./walkup-song-form";

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
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
  if (!team) notFound();

  const list = getSignupListBySlug(team.id, listSlug);
  if (!list) notFound();

  const status = getListStatus(list);
  const isEventTied = list.category === "event-tied";

  return (
    <div className="min-h-dvh bg-[oklch(0.08_0_0)]">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[oklch(0.58_0.23_25)] via-[oklch(0.65_0.20_30)] to-[oklch(0.58_0.23_25)]" />

      {/* Header */}
      <header className="border-b border-[oklch(1_0_0_/_0.06)] bg-[oklch(0.10_0_0)]">
        <div className="mx-auto max-w-lg px-4 py-4">
          <Link
            href={`/t/${teamSlug}`}
            className="mb-3 inline-flex items-center gap-1 text-xs font-700 uppercase tracking-widest text-[oklch(0.40_0_0)] transition-colors hover:text-[oklch(0.60_0_0)]"
          >
            <ArrowLeft className="h-3 w-3" />
            {team.name}
          </Link>

          <h1 className="font-[family-name:var(--font-display)] text-xl font-900 uppercase tracking-tight text-white">
            {list.name}
          </h1>

          {/* Status summary */}
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                status.level === "complete"
                  ? "bg-[oklch(0.65_0.19_145)]"
                  : status.level === "urgent"
                    ? "bg-[oklch(0.62_0.23_25)] animate-pulse-red"
                    : "bg-[oklch(0.45_0_0)]"
              }`}
            />
            <span className="text-xs font-700 text-[oklch(0.50_0_0)]">
              {status.filled} of {status.total}{" "}
              {isEventTied ? "slots filled" : "submitted"}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {/* Event details card */}
        {isEventTied && list.event && (
          <div className="mb-6 animate-slide-up-fade rounded-lg border border-[oklch(1_0_0_/_0.08)] bg-[oklch(0.12_0_0)] p-4">
            <div className="flex items-center gap-2 text-sm font-800 text-white">
              {list.event.isHome ? (
                <Home className="h-4 w-4 text-[oklch(0.62_0.23_25)]" />
              ) : (
                <Plane className="h-4 w-4 text-[oklch(0.55_0_0)]" />
              )}
              {list.event.isHome ? "vs" : "@"} {list.event.opponent}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-600 text-[oklch(0.45_0_0)]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatEventDate(list.event.date)}
              </span>
              {list.event.time && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {list.event.time}
                </span>
              )}
              {list.event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {list.event.location}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Slots / Entries */}
        {isEventTied ? (
          <EventSlotForm list={list} />
        ) : (
          <WalkupSongForm list={list} />
        )}
      </main>
    </div>
  );
}
