"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getTeamBySlug,
  getSignupListBySlug,
  getListStatus,
} from "@/lib/data";
import type { SignupList, SignupEntry, FieldDefinition } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Check,
  UserPlus,
  Music,
  Trash2,
} from "lucide-react";

export default function SignupListPage() {
  const params = useParams<{ teamSlug: string; listSlug: string }>();
  const [list, setList] = useState<SignupList | null>(null);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const team = getTeamBySlug(params.teamSlug);
    if (!team) return;
    setTeamName(team.name);
    const found = getSignupListBySlug(team.id, params.listSlug);
    if (found) {
      // Deep clone so local mutations don't leak into the mock
      setList(JSON.parse(JSON.stringify(found)));
    }
  }, [params.teamSlug, params.listSlug]);

  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  const status = getListStatus(list);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 stripe-pattern" />

      {/* Header */}
      <header className="relative z-10 px-5 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <Link
            href={`/t/${params.teamSlug}`}
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs font-medium tracking-wide uppercase mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {teamName}
          </Link>

          <div className="animate-slide-up">
            <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">
              {list.name}
            </h1>

            {/* Event details for event-tied lists */}
            {list.event && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-2">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5 text-xred" />
                  {new Date(list.event.date + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { weekday: "short", month: "short", day: "numeric" }
                  )}
                </span>
                {list.event.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-xred" />
                    {list.event.time}
                  </span>
                )}
                {list.event.opponent && (
                  <span className="font-medium text-zinc-300">
                    {list.event.isHome ? "vs" : "@"} {list.event.opponent}
                  </span>
                )}
                {list.event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-xred" />
                    {list.event.location}
                  </span>
                )}
              </div>
            )}

            {/* Progress bar */}
            <div className="mt-4 mb-2">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-400">
                  {status.filled} of {status.total} filled
                </span>
                <Badge
                  variant="outline"
                  className={`text-[0.6rem] px-1.5 py-0 ${
                    status.level === "complete"
                      ? "text-emerald-400 border-emerald-500/20"
                      : status.level === "urgent"
                        ? "text-red-400 border-red-500/20"
                        : "text-zinc-400 border-zinc-700"
                  }`}
                >
                  {status.level === "complete"
                    ? "All Filled"
                    : `${status.total - status.filled} open`}
                </Badge>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    status.level === "complete"
                      ? "bg-emerald-500"
                      : "bg-xred"
                  }`}
                  style={{
                    width: `${status.total > 0 ? (status.filled / status.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-5 pb-12">
        <div className="max-w-lg mx-auto">
          {list.category === "event-tied" ? (
            <EventTiedSlots list={list} onUpdate={setList} />
          ) : (
            <StandaloneEntries list={list} onUpdate={setList} />
          )}
        </div>
      </main>
    </div>
  );
}

function EventTiedSlots({
  list,
  onUpdate,
}: {
  list: SignupList;
  onUpdate: (l: SignupList) => void;
}) {
  const slots = Array.from({ length: list.slotsNeeded }, (_, i) => {
    const entry = list.entries.find((e) => e.slotIndex === i);
    return { index: i, entry };
  });

  function handleSignup(slotIndex: number, name: string) {
    const newEntry: SignupEntry = {
      id: `local-${Date.now()}`,
      slotIndex,
      values: { name },
      signedUpAt: new Date().toISOString(),
    };
    const updated = {
      ...list,
      entries: [...list.entries.filter((e) => e.slotIndex !== slotIndex), newEntry],
    };
    onUpdate(updated);
  }

  function handleRemove(slotIndex: number) {
    const updated = {
      ...list,
      entries: list.entries.filter((e) => e.slotIndex !== slotIndex),
    };
    onUpdate(updated);
  }

  return (
    <div className="space-y-3">
      {slots.map(({ index, entry }, i) => (
        <SlotCard
          key={index}
          slotIndex={index}
          slotLabel={`Volunteer ${index + 1}`}
          entry={entry}
          onSignup={(name) => handleSignup(index, name)}
          onRemove={() => handleRemove(index)}
          delay={i * 0.06}
        />
      ))}
    </div>
  );
}

function SlotCard({
  slotIndex,
  slotLabel,
  entry,
  onSignup,
  onRemove,
  delay,
}: {
  slotIndex: number;
  slotLabel: string;
  entry?: SignupEntry;
  onSignup: (name: string) => void;
  onRemove: () => void;
  delay: number;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const isFilled = entry && entry.values.name?.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      onSignup(name.trim());
      setName("");
      setEditing(false);
    }
  }

  return (
    <Card
      className="animate-slide-up bg-zinc-900/60 border-zinc-800/80 overflow-hidden p-0"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[0.65rem] font-bold tracking-widest uppercase text-zinc-500">
            {slotLabel}
          </span>
          {isFilled && (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          )}
        </div>

        {isFilled && !editing ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-xred/10 border border-xred/20 flex items-center justify-center">
                <span className="text-xs font-bold text-xred">
                  {entry!.values.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-white">
                {entry!.values.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onRemove()}
              className="text-zinc-600 hover:text-red-400"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ) : editing ? (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-9 text-sm bg-zinc-800 border-zinc-700 focus:border-xred"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-xred hover:bg-xred-dark text-white"
            >
              Sign Up
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditing(false)}
              className="text-zinc-500"
            >
              Cancel
            </Button>
          </form>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full flex items-center gap-2 py-2 px-3 rounded-lg border border-dashed border-zinc-700 text-zinc-500 hover:text-xred hover:border-xred/40 transition-all group"
          >
            <UserPlus className="w-4 h-4 group-hover:text-xred" />
            <span className="text-sm">Sign up for this slot</span>
          </button>
        )}
      </div>
    </Card>
  );
}

function StandaloneEntries({
  list,
  onUpdate,
}: {
  list: SignupList;
  onUpdate: (l: SignupList) => void;
}) {
  const slots = Array.from({ length: list.slotsNeeded }, (_, i) => {
    const entry = list.entries.find((e) => e.slotIndex === i);
    return { index: i, entry };
  });

  function handleSave(slotIndex: number, values: Record<string, string>) {
    const existing = list.entries.find((e) => e.slotIndex === slotIndex);
    let newEntries: SignupEntry[];
    if (existing) {
      newEntries = list.entries.map((e) =>
        e.slotIndex === slotIndex ? { ...e, values } : e
      );
    } else {
      newEntries = [
        ...list.entries,
        {
          id: `local-${Date.now()}`,
          slotIndex,
          values,
          signedUpAt: new Date().toISOString(),
        },
      ];
    }
    onUpdate({ ...list, entries: newEntries });
  }

  return (
    <div className="space-y-3">
      {slots.map(({ index, entry }, i) => (
        <WalkupSongCard
          key={index}
          slotIndex={index}
          entry={entry}
          fields={list.fields}
          onSave={(values) => handleSave(index, values)}
          delay={i * 0.04}
        />
      ))}
    </div>
  );
}

function WalkupSongCard({
  slotIndex,
  entry,
  fields,
  onSave,
  delay,
}: {
  slotIndex: number;
  entry?: SignupEntry;
  fields: FieldDefinition[];
  onSave: (values: Record<string, string>) => void;
  delay: number;
}) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(
    entry?.values || {}
  );

  useEffect(() => {
    setValues(entry?.values || {});
  }, [entry]);

  const playerName = values.playerName || `Player ${slotIndex + 1}`;
  const hasSong = values.songName?.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(values);
    setEditing(false);
  }

  return (
    <Card
      className="animate-slide-up bg-zinc-900/60 border-zinc-800/80 overflow-hidden p-0"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="px-4 py-3">
        {/* Player header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                hasSong
                  ? "bg-xred/10 border border-xred/20 text-xred"
                  : "bg-zinc-800 border border-zinc-700 text-zinc-500"
              }`}
            >
              {slotIndex + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {playerName}
              </p>
              {hasSong ? (
                <p className="text-xs text-zinc-400 flex items-center gap-1">
                  <Music className="w-3 h-3 text-xred" />
                  {values.artistName} &mdash; {values.songName}
                  {values.startAt && (
                    <span className="text-zinc-600 ml-1">
                      @ {values.startAt}
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-xs text-zinc-600">No song submitted</p>
              )}
            </div>
          </div>

          {!editing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
              className="text-zinc-500 hover:text-xred text-xs"
            >
              {hasSong ? "Edit" : "Add"}
            </Button>
          )}
        </div>

        {/* Edit form */}
        {editing && (
          <form onSubmit={handleSubmit} className="mt-3 space-y-2">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="text-[0.65rem] font-semibold text-zinc-500 uppercase tracking-wider">
                  {field.label}
                  {field.required && (
                    <span className="text-xred ml-0.5">*</span>
                  )}
                </label>
                <Input
                  value={values[field.key] || ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.key]: e.target.value }))
                  }
                  placeholder={field.label}
                  className="h-9 text-sm bg-zinc-800 border-zinc-700 focus:border-xred mt-1"
                />
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="submit"
                size="sm"
                className="bg-xred hover:bg-xred-dark text-white"
              >
                Save
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setValues(entry?.values || {});
                  setEditing(false);
                }}
                className="text-zinc-500"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
