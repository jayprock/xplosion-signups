"use client";

import { useState } from "react";
import { UserPlus, Check, X } from "lucide-react";
import type { SignupList } from "@/lib/types";

export function EventSlotForm({ list }: { list: SignupList }) {
  // Build slot array: for each slot index, find existing entry or leave empty
  const initialSlots = Array.from({ length: list.slotsNeeded }, (_, i) => {
    const entry = list.entries.find((e) => e.slotIndex === i);
    return entry?.values.name ?? "";
  });

  const [slots, setSlots] = useState(initialSlots);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  function startEditing(index: number) {
    setEditingIndex(index);
    setEditValue(slots[index]);
  }

  function saveSlot(index: number) {
    const newSlots = [...slots];
    newSlots[index] = editValue.trim();
    setSlots(newSlots);
    setEditingIndex(null);
    setEditValue("");
  }

  function clearSlot(index: number) {
    const newSlots = [...slots];
    newSlots[index] = "";
    setSlots(newSlots);
    setEditingIndex(null);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-700 uppercase tracking-widest text-[oklch(0.40_0_0)]">
        Volunteer Slots
      </p>

      {slots.map((name, i) => {
        const isFilled = name.trim() !== "";
        const isEditing = editingIndex === i;

        return (
          <div
            key={i}
            className={`animate-slide-up-fade rounded-lg border transition-all ${
              isFilled
                ? "border-[oklch(0.65_0.19_145_/_0.2)] bg-[oklch(0.65_0.19_145_/_0.04)]"
                : "border-[oklch(1_0_0_/_0.08)] bg-[oklch(0.12_0_0)]"
            }`}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="p-4">
              <div className="mb-1 text-[10px] font-800 uppercase tracking-widest text-[oklch(0.35_0_0)]">
                Slot {i + 1}
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveSlot(i);
                      if (e.key === "Escape") setEditingIndex(null);
                    }}
                    placeholder="Enter your name"
                    autoFocus
                    className="h-10 flex-1 rounded-md border border-[oklch(0.58_0.23_25_/_0.4)] bg-[oklch(0.08_0_0)] px-3 text-sm font-600 text-white placeholder:text-[oklch(0.30_0_0)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.58_0.23_25_/_0.3)]"
                  />
                  <button
                    onClick={() => saveSlot(i)}
                    className="flex h-10 w-10 items-center justify-center rounded-md bg-[oklch(0.58_0.23_25)] text-white transition-colors hover:bg-[oklch(0.52_0.23_25)]"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-[oklch(1_0_0_/_0.1)] text-[oklch(0.50_0_0)] transition-colors hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : isFilled ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[oklch(0.65_0.19_145_/_0.15)]">
                      <Check className="h-3.5 w-3.5 text-[oklch(0.70_0.16_145)]" />
                    </div>
                    <span className="text-sm font-700 text-white">{name}</span>
                  </div>
                  <button
                    onClick={() => clearSlot(i)}
                    className="text-[10px] font-700 uppercase tracking-widest text-[oklch(0.35_0_0)] transition-colors hover:text-[oklch(0.62_0.23_25)]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing(i)}
                  className="flex w-full items-center gap-2 text-left"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-[oklch(1_0_0_/_0.1)]">
                    <UserPlus className="h-3.5 w-3.5 text-[oklch(0.35_0_0)]" />
                  </div>
                  <span className="text-sm font-600 text-[oklch(0.35_0_0)]">
                    Tap to sign up
                  </span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
