"use client";

import { useState, type FormEvent } from "react";
import type { SignupList, SignupEntry } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, User } from "lucide-react";

export function EventSignupList({ list }: { list: SignupList }) {
  const [entries, setEntries] = useState<SignupEntry[]>(list.entries);
  const [inputs, setInputs] = useState<Record<number, string>>({});

  function handleSignup(slotIndex: number) {
    const name = inputs[slotIndex]?.trim();
    if (!name) return;

    const newEntry: SignupEntry = {
      id: `temp-${Date.now()}-${slotIndex}`,
      slotIndex,
      values: { name },
      signedUpAt: new Date().toISOString(),
    };

    setEntries((prev) => [...prev, newEntry]);
    setInputs((prev) => ({ ...prev, [slotIndex]: "" }));
  }

  function handleClear(slotIndex: number) {
    setEntries((prev) => prev.filter((e) => e.slotIndex !== slotIndex));
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: list.slotsNeeded }, (_, i) => {
        const entry = entries.find((e) => e.slotIndex === i);

        return (
          <div
            key={i}
            className={`flex items-center gap-3 p-3.5 rounded-lg border transition-colors ${
              entry
                ? "bg-card border-border"
                : "bg-secondary/30 border-dashed border-border/60"
            }`}
          >
            {/* Slot number */}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 ${
                entry
                  ? "bg-primary/15 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>

            {entry ? (
              <>
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <User className="size-4 text-primary shrink-0" />
                  <span className="font-medium truncate">
                    {entry.values.name}
                  </span>
                </div>
                <button
                  onClick={() => handleClear(i)}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1"
                  aria-label="Remove signup"
                >
                  <X className="size-4" />
                </button>
              </>
            ) : (
              <form
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  handleSignup(i);
                }}
                className="flex-1 flex items-center gap-2"
              >
                <Input
                  value={inputs[i] || ""}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      [i]: e.target.value,
                    }))
                  }
                  placeholder="Your name"
                  className="h-9 bg-background/50 border-border/50 text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 shrink-0"
                  disabled={!inputs[i]?.trim()}
                >
                  <Check className="size-3.5" />
                </Button>
              </form>
            )}
          </div>
        );
      })}
    </div>
  );
}
