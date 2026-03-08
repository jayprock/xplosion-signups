"use client";

import { useState } from "react";
import type { SignupList, SignupEntry } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Music, Check, Pencil } from "lucide-react";

export function WalkupSongList({ list }: { list: SignupList }) {
  const [entries, setEntries] = useState<SignupEntry[]>(list.entries);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>(
    {}
  );

  function startEditing(slotIndex: number) {
    const entry = entries.find((e) => e.slotIndex === slotIndex);
    setEditingIndex(slotIndex);
    setEditValues(entry?.values || {});
  }

  function saveEdit(slotIndex: number) {
    setEntries((prev) => {
      const existing = prev.find((e) => e.slotIndex === slotIndex);
      if (existing) {
        return prev.map((e) =>
          e.slotIndex === slotIndex
            ? { ...e, values: { ...e.values, ...editValues } }
            : e
        );
      }
      return [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          slotIndex,
          values: {
            playerName: `Player ${slotIndex + 1}`,
            ...editValues,
          },
          signedUpAt: new Date().toISOString(),
        },
      ];
    });
    setEditingIndex(null);
    setEditValues({});
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditValues({});
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: list.slotsNeeded }, (_, i) => {
        const entry = entries.find((e) => e.slotIndex === i);
        const isEditing = editingIndex === i;
        const playerName =
          entry?.values.playerName || `Player ${i + 1}`;
        const hasSong =
          entry?.values.songName &&
          entry.values.songName.trim() !== "";

        return (
          <div
            key={i}
            className={`p-4 rounded-lg border transition-colors ${
              isEditing
                ? "bg-primary/5 border-primary/30"
                : "bg-card border-border"
            }`}
          >
            {/* Player header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-muted-foreground tabular-nums w-5 text-right">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold text-sm">
                  {playerName}
                </span>
              </div>
              {!isEditing && (
                <button
                  onClick={() => startEditing(i)}
                  className="text-muted-foreground hover:text-primary transition-colors p-1"
                  aria-label="Edit song"
                >
                  {hasSong ? (
                    <Pencil className="size-3.5" />
                  ) : (
                    <Music className="size-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Song display or edit form */}
            {isEditing ? (
              <div className="space-y-3 mt-3 pl-[30px]">
                {list.fields
                  .filter((f) => f.key !== "playerName")
                  .map((field) => (
                    <div key={field.key}>
                      <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        {field.label}
                      </label>
                      <Input
                        value={editValues[field.key] || ""}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        placeholder={field.label}
                        className="h-9 bg-background/50 border-border/50 text-sm"
                      />
                    </div>
                  ))}
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={() => saveEdit(i)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Check className="size-3.5 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="pl-[30px] mt-1 cursor-pointer group"
                onClick={() => startEditing(i)}
              >
                {hasSong ? (
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    <span className="text-foreground">
                      {entry?.values.artistName}
                    </span>
                    {" \u2014 "}
                    <span className="italic text-foreground">
                      {entry?.values.songName}
                    </span>
                    {entry?.values.startAt && (
                      <span className="text-muted-foreground ml-1.5 text-xs">
                        (start: {entry.values.startAt})
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic group-hover:text-muted-foreground transition-colors">
                    Tap to add a song
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
