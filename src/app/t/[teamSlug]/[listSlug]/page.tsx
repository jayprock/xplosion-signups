"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  getTeamBySlug,
  getSignupListBySlug,
  getListStatus,
} from "@/lib/data";
import type { SignupList, SignupEntry, UrgencyLevel } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Swords,
  CheckCircle2,
  UserPlus,
  X,
  Music,
  AlertCircle,
} from "lucide-react";

function urgencyLabel(level: UrgencyLevel) {
  switch (level) {
    case "urgent":
      return { text: "Needs Volunteers Now", className: "bg-urgent/10 text-urgent border-urgent/20" };
    case "high":
      return { text: "Coming Up Soon", className: "bg-high/10 text-high border-high/20" };
    case "warning":
      return { text: "3 Weeks Out", className: "bg-warning/10 text-warning border-warning/20" };
    case "info":
      return { text: "Upcoming", className: "bg-muted text-muted-foreground border-border" };
    case "complete":
      return { text: "All Filled!", className: "bg-complete/10 text-complete border-complete/20" };
  }
}

function EventHeader({ list }: { list: SignupList }) {
  if (!list.event) return null;
  const evt = list.event;
  const eventDate = new Date(evt.date);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-14 rounded-lg bg-team-red/10 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase text-team-red">
            {eventDate.toLocaleDateString("en-US", { weekday: "short" })}
          </span>
          <span className="text-lg font-bold leading-tight text-team-red">
            {eventDate.getDate()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Swords className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-semibold text-sm">vs {evt.opponent}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {evt.isHome ? "Home" : "Away"}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            {evt.time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {evt.time}
              </span>
            )}
            {evt.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {evt.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {eventDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VolunteerSlot({
  slotIndex,
  entry,
  onSignUp,
  onRemove,
}: {
  slotIndex: number;
  entry: SignupEntry | undefined;
  onSignUp: (slotIndex: number, name: string) => void;
  onRemove: (slotIndex: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const isFilled = entry && entry.values.name?.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSignUp(slotIndex, name.trim());
    setName("");
    setEditing(false);
  }

  if (isFilled) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-complete/5 border border-complete/20 group">
        <CheckCircle2 className="w-4 h-4 text-complete flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium">{entry.values.name}</span>
          <span className="text-[10px] text-muted-foreground ml-2">
            Slot {slotIndex + 1}
          </span>
        </div>
        <button
          onClick={() => onRemove(slotIndex)}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded"
          title="Remove sign-up"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (editing) {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-2 rounded-lg border border-team-red/30 bg-team-red/5 ring-2 ring-team-red/10"
      >
        <UserPlus className="w-4 h-4 text-team-red flex-shrink-0 ml-1" />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your name..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          autoFocus
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="bg-team-red hover:bg-red-700 disabled:opacity-40 text-white rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setName("");
          }}
          className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-team-red/40 hover:bg-team-red/5 transition-all w-full text-left group"
    >
      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 group-hover:border-team-red/50 transition-colors" />
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        Slot {slotIndex + 1} — Tap to sign up
      </span>
    </button>
  );
}

function WalkupSongEntry({
  slotIndex,
  entry,
  fields,
  onUpdate,
}: {
  slotIndex: number;
  entry: SignupEntry;
  fields: SignupList["fields"];
  onUpdate: (slotIndex: number, values: Record<string, string>) => void;
}) {
  const [values, setValues] = useState(entry.values);
  const [dirty, setDirty] = useState(false);

  const playerName = values.playerName || `Player ${slotIndex + 1}`;
  const hasSong = values.songName?.trim() && values.artistName?.trim();

  function handleChange(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
    setDirty(true);
  }

  function handleSave() {
    onUpdate(slotIndex, values);
    setDirty(false);
  }

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all ${
        hasSong
          ? "border-complete/20 bg-card"
          : "border-border bg-card"
      }`}
    >
      {/* Player header */}
      <div
        className={`px-4 py-2.5 flex items-center gap-2 ${
          hasSong ? "bg-complete/5" : "bg-muted/30"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
            hasSong
              ? "bg-complete/10 text-complete"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {slotIndex + 1}
        </div>
        <span className="font-semibold text-sm flex-1 truncate">
          {playerName}
        </span>
        {hasSong ? (
          <CheckCircle2 className="w-4 h-4 text-complete flex-shrink-0" />
        ) : (
          <Music className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
        )}
      </div>

      {/* Song fields */}
      <div className="px-4 py-3 space-y-2">
        {fields
          .filter((f) => f.key !== "playerName")
          .map((field) => (
            <div key={field.key}>
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                {field.label}
                {field.required && <span className="text-team-red ml-0.5">*</span>}
              </label>
              <input
                type="text"
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={
                  field.key === "artistName"
                    ? "e.g. Imagine Dragons"
                    : field.key === "songName"
                      ? "e.g. Thunder"
                      : field.key === "startAt"
                        ? "e.g. 0:30 or 'start of chorus'"
                        : ""
                }
                className="w-full bg-muted/50 rounded-md px-2.5 py-1.5 text-sm placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-team-red/20 transition-all border border-transparent focus:border-team-red/30"
              />
            </div>
          ))}
        {dirty && (
          <button
            onClick={handleSave}
            className="mt-1 bg-team-red hover:bg-red-700 text-white rounded-md px-3 py-1.5 text-xs font-semibold transition-colors w-full animate-fade-in"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}

export default function SignupListPage({
  params,
}: {
  params: Promise<{ teamSlug: string; listSlug: string }>;
}) {
  const { teamSlug, listSlug } = use(params);
  const team = getTeamBySlug(teamSlug);
  const [list, setList] = useState<SignupList | null>(null);

  useEffect(() => {
    if (!team) return;
    const found = getSignupListBySlug(team.id, listSlug);
    if (found) {
      // Deep clone to allow local mutations
      setList(JSON.parse(JSON.stringify(found)));
    }
  }, [team, listSlug]);

  if (!team) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-muted-foreground">Team not found.</p>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-muted-foreground">List not found.</p>
      </div>
    );
  }

  const status = getListStatus(list);
  const statusInfo = urgencyLabel(status.level);
  const isEventTied = list.category === "event-tied";

  function handleSignUp(slotIndex: number, name: string) {
    setList((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, entries: [...prev.entries] };
      updated.entries.push({
        id: `local-${Date.now()}`,
        slotIndex,
        values: { name },
        signedUpAt: new Date().toISOString(),
      });
      return updated;
    });
  }

  function handleRemove(slotIndex: number) {
    setList((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        entries: prev.entries.filter((e) => e.slotIndex !== slotIndex),
      };
    });
  }

  function handleUpdateSong(slotIndex: number, values: Record<string, string>) {
    setList((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        entries: prev.entries.map((e) =>
          e.slotIndex === slotIndex ? { ...e, values } : e
        ),
      };
    });
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 h-12 flex items-center gap-3">
          <Link
            href={`/t/${teamSlug}`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-sm truncate">{list.name}</span>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${statusInfo.className}`}
          >
            {status.filled}/{status.total} filled
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-8">
        {/* Event info */}
        {isEventTied && (
          <div className="pt-4 animate-slide-up">
            <EventHeader list={list} />
          </div>
        )}

        {/* Status banner */}
        {status.level !== "complete" && status.level !== "info" && isEventTied && (
          <div
            className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 border ${statusInfo.className} animate-slide-up`}
            style={{ animationDelay: "0.05s" }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-medium">{statusInfo.text}</span>
          </div>
        )}

        {/* Title + description */}
        <div
          className="pt-5 pb-1 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="text-lg font-bold tracking-tight">{list.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEventTied
              ? `${status.total} volunteer ${status.total === 1 ? "slot" : "slots"} — ${status.filled} filled, ${status.total - status.filled} open`
              : `${status.filled} of ${status.total} players have submitted`}
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="mt-3 mb-5 animate-slide-up"
          style={{ animationDelay: "0.12s" }}
        >
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                status.level === "complete"
                  ? "bg-complete"
                  : status.level === "urgent"
                    ? "bg-urgent"
                    : status.level === "high"
                      ? "bg-high"
                      : status.level === "warning"
                        ? "bg-warning"
                        : "bg-muted-foreground/40"
              }`}
              style={{
                width: `${Math.round((status.filled / status.total) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Slots / Entries */}
        <div className="space-y-2">
          {isEventTied ? (
            // Event-tied: render volunteer slots
            Array.from({ length: list.slotsNeeded }).map((_, i) => {
              const entry = list.entries.find((e) => e.slotIndex === i);
              return (
                <div
                  key={i}
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.15 + i * 0.03}s` }}
                >
                  <VolunteerSlot
                    slotIndex={i}
                    entry={entry}
                    onSignUp={handleSignUp}
                    onRemove={handleRemove}
                  />
                </div>
              );
            })
          ) : (
            // Standalone: render walk-up song entries
            list.entries.map((entry, i) => (
              <div
                key={entry.id}
                className="animate-slide-up"
                style={{ animationDelay: `${0.15 + i * 0.02}s` }}
              >
                <WalkupSongEntry
                  slotIndex={entry.slotIndex}
                  entry={entry}
                  fields={list.fields}
                  onUpdate={handleUpdateSong}
                />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
