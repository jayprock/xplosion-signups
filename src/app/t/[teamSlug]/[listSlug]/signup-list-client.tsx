"use client";

import { useState } from "react";
import Link from "next/link";
import type { Team, SignupList, SignupEntry } from "@/lib/types";
import { getListStatus } from "@/lib/data";
import { StatusBadge } from "@/components/status-badge";
import {
  ArrowLeft,
  Check,
  X as XIcon,
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function SignupListClient({
  team,
  list: initialList,
}: {
  team: Team;
  list: SignupList;
}) {
  const [entries, setEntries] = useState<SignupEntry[]>(() =>
    initialList.entries.map((e) => ({ ...e, values: { ...e.values } }))
  );

  const currentList = { ...initialList, entries };
  const status = getListStatus(currentList);

  return (
    <div className="min-h-dvh bg-neutral-100">
      {/* Header */}
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-4">
          <Link
            href={`/t/${team.slug}`}
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="size-3.5" />
            {team.name}
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Title section */}
        <div>
          <h1 className="font-heading text-3xl tracking-tight text-neutral-900 leading-none">
            {currentList.name.toUpperCase()}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <StatusBadge level={status.level} />
            <span className="text-sm text-neutral-500">
              {status.filled} of {status.total} filled
            </span>
          </div>
        </div>

        {/* Date/location info for dated sign-ups */}
        {currentList.date && (
          <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4">
            {currentList.note && (
              <p className="text-sm text-neutral-500 mb-2">
                {currentList.note}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5 text-neutral-400" />
                {formatDate(currentList.date)}
              </span>
              {currentList.time && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5 text-neutral-400" />
                  {currentList.time}
                </span>
              )}
              {currentList.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-neutral-400" />
                  {currentList.location}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Slots/entries */}
        {currentList.category === "dated" ? (
          <EventTiedSlots
            list={currentList}
            entries={entries}
            onSignUp={(slotIndex, name) => {
              setEntries((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  slotIndex,
                  values: { name },
                  signedUpAt: new Date().toISOString(),
                },
              ]);
            }}
            onUpdate={(entryId, values) => {
              setEntries((prev) =>
                prev.map((e) =>
                  e.id === entryId
                    ? { ...e, values: { ...e.values, ...values } }
                    : e
                )
              );
            }}
            onRemove={(entryId) => {
              setEntries((prev) => prev.filter((e) => e.id !== entryId));
            }}
          />
        ) : (
          <StandaloneEntries
            list={currentList}
            entries={entries}
            onUpdate={(entryId, values) => {
              setEntries((prev) =>
                prev.map((e) =>
                  e.id === entryId
                    ? { ...e, values: { ...e.values, ...values } }
                    : e
                )
              );
            }}
            onRemove={(entryId) => {
              setEntries((prev) => prev.filter((e) => e.id !== entryId));
            }}
            onAdd={(values) => {
              setEntries((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  slotIndex: prev.length,
                  values,
                  signedUpAt: new Date().toISOString(),
                },
              ]);
            }}
          />
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Event-tied slots                                                   */
/* ------------------------------------------------------------------ */

function EventTiedSlots({
  list,
  entries,
  onSignUp,
  onUpdate,
  onRemove,
}: {
  list: SignupList;
  entries: SignupEntry[];
  onSignUp: (slotIndex: number, name: string) => void;
  onUpdate: (entryId: string, values: Record<string, string>) => void;
  onRemove: (entryId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
        Volunteer Slots
      </h2>
      {Array.from({ length: list.slotsNeeded }, (_, i) => {
        const entry = entries.find((e) => e.slotIndex === i);
        return (
          <VolunteerSlot
            key={i}
            slotNumber={i + 1}
            entry={entry}
            onSignUp={(name) => onSignUp(i, name)}
            onUpdate={(values) => entry && onUpdate(entry.id, values)}
            onRemove={() => entry && onRemove(entry.id)}
          />
        );
      })}
    </div>
  );
}

function VolunteerSlot({
  slotNumber,
  entry,
  onSignUp,
  onUpdate,
  onRemove,
}: {
  slotNumber: number;
  entry?: SignupEntry;
  onSignUp: (name: string) => void;
  onUpdate: (values: Record<string, string>) => void;
  onRemove: () => void;
}) {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);

  if (entry && editing) {
    return (
      <div className="bg-white rounded-2xl ring-1 ring-red-500/20 shadow-sm p-4">
        <p className="text-xs text-neutral-400 font-medium mb-2">
          Slot {slotNumber}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editName.trim()) {
              onUpdate({ name: editName.trim() });
              setEditing(false);
            }
          }}
          className="flex gap-2"
        >
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            autoFocus
            className="flex-1 h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!editName.trim()}
            className="h-10 px-4 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 disabled:opacity-30 transition-all shrink-0"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="h-10 px-3 rounded-xl text-neutral-500 text-sm font-medium hover:bg-neutral-100 transition-colors shrink-0"
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  if (entry) {
    return (
      <div className="bg-white rounded-2xl ring-1 ring-emerald-500/20 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <Check className="size-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-400 font-medium">
              Slot {slotNumber}
            </p>
            <p className="font-semibold text-neutral-900 truncate">
              {entry.values.name}
            </p>
          </div>
          <button
            onClick={() => {
              setEditName(entry.values.name);
              setEditing(true);
            }}
            className="size-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center transition-colors text-neutral-300 hover:text-neutral-600"
            title="Edit"
          >
            <Pencil className="size-3.5" />
          </button>
          {confirmRemove ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onRemove}
                className="h-7 px-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-500 transition-all"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmRemove(false)}
                className="h-7 px-2 rounded-lg text-neutral-500 text-xs hover:bg-neutral-100 transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmRemove(true)}
              className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-neutral-300 hover:text-red-500"
              title="Remove"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4">
      <p className="text-xs text-neutral-400 font-medium mb-2">
        Slot {slotNumber}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) {
            onSignUp(name.trim());
            setName("");
          }
        }}
        className="flex gap-2"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="flex-1 h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="h-10 px-5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Standalone entries (walk-up songs)                                 */
/* ------------------------------------------------------------------ */

function StandaloneEntries({
  list,
  entries,
  onUpdate,
  onRemove,
  onAdd,
}: {
  list: SignupList;
  entries: SignupEntry[];
  onUpdate: (entryId: string, values: Record<string, string>) => void;
  onRemove: (entryId: string) => void;
  onAdd: (values: Record<string, string>) => void;
}) {
  const requiredFields = list.fields.filter((f) => f.required);
  const isComplete = (entry: SignupEntry) =>
    requiredFields.every((f) => {
      const v = entry.values[f.key];
      return v && v.trim() !== "";
    });

  return (
    <div className="space-y-3">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
        Player Entries
      </h2>
      {entries.map((entry, i) => (
        <SongEntry
          key={entry.id}
          entry={entry}
          number={i + 1}
          fields={list.fields}
          complete={isComplete(entry)}
          onUpdate={(values) => onUpdate(entry.id, values)}
          onRemove={() => onRemove(entry.id)}
        />
      ))}
      {entries.length < list.slotsNeeded && (
        <NewSongEntry fields={list.fields} onAdd={onAdd} />
      )}
    </div>
  );
}

function SongEntry({
  entry,
  number,
  fields,
  complete,
  onUpdate,
  onRemove,
}: {
  entry: SignupEntry;
  number: number;
  fields: SignupList["fields"];
  complete: boolean;
  onUpdate: (values: Record<string, string>) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(!complete);
  const [formValues, setFormValues] = useState<Record<string, string>>(
    entry.values
  );
  const [confirmRemove, setConfirmRemove] = useState(false);

  const playerName = entry.values.playerName || `Player ${number}`;
  const editableFields = fields.filter((f) => f.key !== "playerName");

  if (complete && !editing) {
    return (
      <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-full bg-emerald-50 flex items-center justify-center text-sm font-bold text-emerald-700 shrink-0">
            {number}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-neutral-900">{playerName}</p>
            <p className="text-sm text-neutral-600 truncate">
              &ldquo;{entry.values.songName}&rdquo; by{" "}
              {entry.values.artistName}
            </p>
            {entry.values.startAt && (
              <p className="text-xs text-neutral-400 mt-0.5">
                Start at {entry.values.startAt}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="size-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center transition-colors text-neutral-300 hover:text-neutral-600"
              title="Edit"
            >
              <Pencil className="size-3.5" />
            </button>
            {confirmRemove ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={onRemove}
                  className="h-7 px-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-500 transition-all"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmRemove(false)}
                  className="h-7 px-2 rounded-lg text-neutral-500 text-xs hover:bg-neutral-100 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmRemove(true)}
                className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-neutral-300 hover:text-red-500"
                title="Remove"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`size-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
            complete
              ? "bg-emerald-50 text-emerald-700"
              : "bg-neutral-100 text-neutral-400"
          }`}
        >
          {number}
        </div>
        <p className="font-semibold text-neutral-900 flex-1">{playerName}</p>
        {confirmRemove ? (
          <div className="flex items-center gap-1">
            <button
              onClick={onRemove}
              className="h-7 px-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-500 transition-all"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmRemove(false)}
              className="h-7 px-2 rounded-lg text-neutral-500 text-xs hover:bg-neutral-100 transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmRemove(true)}
            className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-neutral-300 hover:text-red-500 shrink-0"
            title="Remove"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
      <div className="space-y-2 pl-12">
        {editableFields.map((field) => (
          <input
            key={field.key}
            value={formValues[field.key] || ""}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                [field.key]: e.target.value,
              }))
            }
            placeholder={field.label + (field.required ? "" : " (optional)")}
            className="w-full h-9 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
          />
        ))}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => {
              onUpdate(formValues);
              const allRequired = fields.filter((f) => f.required);
              const nowComplete = allRequired.every((f) => {
                const v = formValues[f.key];
                return v && v.trim() !== "";
              });
              if (nowComplete) setEditing(false);
            }}
            className="h-9 px-5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 transition-all"
          >
            Save
          </button>
          {complete && (
            <button
              onClick={() => setEditing(false)}
              className="h-9 px-4 rounded-xl text-neutral-500 text-sm font-medium hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NewSongEntry({
  fields,
  onAdd,
}: {
  fields: SignupList["fields"];
  onAdd: (values: Record<string, string>) => void;
}) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white rounded-2xl ring-1 ring-dashed ring-neutral-300 p-4 text-sm text-neutral-400 font-medium hover:ring-neutral-400 hover:text-neutral-500 transition-all text-center"
      >
        + Add Player Entry
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl ring-1 ring-red-500/20 shadow-sm p-4">
      <p className="text-sm font-semibold text-neutral-900 mb-3">New Entry</p>
      <div className="space-y-2">
        {fields.map((field) => (
          <input
            key={field.key}
            value={formValues[field.key] || ""}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                [field.key]: e.target.value,
              }))
            }
            placeholder={field.label + (field.required ? "" : " (optional)")}
            className="w-full h-9 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
          />
        ))}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => {
              const requiredFields = fields.filter((f) => f.required);
              const allFilled = requiredFields.every((f) => {
                const v = formValues[f.key];
                return v && v.trim() !== "";
              });
              if (allFilled) {
                onAdd(formValues);
                setFormValues({});
                setIsOpen(false);
              }
            }}
            className="h-9 px-5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 transition-all"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setFormValues({});
            }}
            className="h-9 px-4 rounded-xl text-neutral-500 text-sm font-medium hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
