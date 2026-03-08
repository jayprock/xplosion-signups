"use client";

import { useState } from "react";
import { Music, ChevronDown, ChevronUp, Check } from "lucide-react";
import type { SignupList } from "@/lib/types";

type SongEntry = {
  playerName: string;
  artistName: string;
  songName: string;
  startAt: string;
};

export function WalkupSongForm({ list }: { list: SignupList }) {
  // Build initial entries from mock data
  const initialEntries: SongEntry[] = Array.from(
    { length: list.slotsNeeded },
    (_, i) => {
      const entry = list.entries.find((e) => e.slotIndex === i);
      return {
        playerName: entry?.values.playerName ?? "",
        artistName: entry?.values.artistName ?? "",
        songName: entry?.values.songName ?? "",
        startAt: entry?.values.startAt ?? "",
      };
    }
  );

  const [entries, setEntries] = useState(initialEntries);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function updateEntry(index: number, field: keyof SongEntry, value: string) {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function isFilled(entry: SongEntry) {
    return (
      entry.playerName.trim() !== "" &&
      entry.artistName.trim() !== "" &&
      entry.songName.trim() !== ""
    );
  }

  function hasPlayer(entry: SongEntry) {
    return entry.playerName.trim() !== "";
  }

  return (
    <div className="space-y-2">
      <p className="mb-3 text-xs font-700 uppercase tracking-widest text-[oklch(0.40_0_0)]">
        Player Entries
      </p>

      {entries.map((entry, i) => {
        const filled = isFilled(entry);
        const hasName = hasPlayer(entry);
        const isExpanded = expandedIndex === i;

        return (
          <div
            key={i}
            className={`animate-slide-up-fade overflow-hidden rounded-lg border transition-all ${
              filled
                ? "border-[oklch(0.65_0.19_145_/_0.2)] bg-[oklch(0.65_0.19_145_/_0.04)]"
                : "border-[oklch(1_0_0_/_0.08)] bg-[oklch(0.12_0_0)]"
            }`}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            {/* Collapsed header */}
            <button
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                  filled
                    ? "bg-[oklch(0.65_0.19_145_/_0.15)]"
                    : hasName
                      ? "bg-[oklch(0.58_0.23_25_/_0.1)]"
                      : "border-2 border-dashed border-[oklch(1_0_0_/_0.1)]"
                }`}
              >
                {filled ? (
                  <Check className="h-4 w-4 text-[oklch(0.70_0.16_145)]" />
                ) : (
                  <Music className="h-4 w-4 text-[oklch(0.35_0_0)]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-700 ${hasName ? "text-white" : "text-[oklch(0.35_0_0)]"}`}
                >
                  {hasName ? entry.playerName : `Player ${i + 1}`}
                </p>
                {filled && (
                  <p className="truncate text-xs font-600 text-[oklch(0.45_0_0)]">
                    {entry.artistName} &mdash; {entry.songName}
                  </p>
                )}
                {hasName && !filled && (
                  <p className="text-xs font-600 text-[oklch(0.58_0.23_25_/_0.7)]">
                    Needs song details
                  </p>
                )}
              </div>

              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-[oklch(0.40_0_0)]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[oklch(0.30_0_0)]" />
              )}
            </button>

            {/* Expanded form */}
            {isExpanded && (
              <div className="border-t border-[oklch(1_0_0_/_0.06)] px-4 pb-4 pt-3">
                <div className="space-y-3">
                  <FormField
                    label="Player Name"
                    value={entry.playerName}
                    onChange={(v) => updateEntry(i, "playerName", v)}
                    placeholder="e.g. Jake Smith"
                    required
                  />
                  <FormField
                    label="Artist"
                    value={entry.artistName}
                    onChange={(v) => updateEntry(i, "artistName", v)}
                    placeholder="e.g. AC/DC"
                    required
                  />
                  <FormField
                    label="Song Name"
                    value={entry.songName}
                    onChange={(v) => updateEntry(i, "songName", v)}
                    placeholder="e.g. Thunderstruck"
                    required
                  />
                  <FormField
                    label="Start At"
                    value={entry.startAt}
                    onChange={(v) => updateEntry(i, "startAt", v)}
                    placeholder="e.g. 0:30 or 'chorus'"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-800 uppercase tracking-widest text-[oklch(0.40_0_0)]">
        {label}
        {required && (
          <span className="ml-0.5 text-[oklch(0.58_0.23_25)]">*</span>
        )}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-[oklch(1_0_0_/_0.1)] bg-[oklch(0.08_0_0)] px-3 text-sm font-600 text-white placeholder:text-[oklch(0.28_0_0)] focus:border-[oklch(0.58_0.23_25_/_0.4)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.58_0.23_25_/_0.2)] transition-all"
      />
    </div>
  );
}
