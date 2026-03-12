"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { SignupList, FieldDefinition, SignupListCategory } from "@/lib/types";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

type ListFormProps = {
  teamSlug: string;
  teamName: string;
  /** Existing list for editing, undefined for creating */
  list?: SignupList;
  onSubmit: (data: {
    name: string;
    category: SignupListCategory;
    date?: string;
    time?: string;
    location?: string;
    note?: string;
    slotsNeeded: number;
    fields: FieldDefinition[];
  }) => Promise<{ error: string } | void | undefined>;
};

export function ListForm({ teamSlug, teamName, list, onSubmit }: ListFormProps) {
  const isEdit = !!list;

  const [name, setName] = useState(list?.name ?? "");
  const [category, setCategory] = useState<SignupListCategory>(
    list?.category ?? "dated"
  );
  const [date, setDate] = useState(list?.date ?? "");
  const [time, setTime] = useState(list?.time ?? "");
  const [location, setLocation] = useState(list?.location ?? "");
  const [note, setNote] = useState(list?.note ?? "");
  const [slotsNeeded, setSlotsNeeded] = useState(list?.slotsNeeded ?? 1);
  const [fields, setFields] = useState<FieldDefinition[]>(
    list?.fields ?? [
      { key: "name", label: "Your Name", type: "text", required: true },
    ]
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function addField() {
    setFields((prev) => [
      ...prev,
      {
        key: `field-${Date.now()}`,
        label: "",
        type: "text",
        required: false,
      },
    ]);
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  function updateField(index: number, updates: Partial<FieldDefinition>) {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== index) return f;
        const updated = { ...f, ...updates };
        // Auto-generate key from label
        if (updates.label !== undefined) {
          updated.key = updates.label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_|_$/g, "") || f.key;
        }
        return updated;
      })
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (slotsNeeded < 1) {
      setError("Slots needed must be at least 1");
      return;
    }
    if (fields.some((f) => !f.label.trim())) {
      setError("All field labels are required");
      return;
    }

    startTransition(async () => {
      const result = await onSubmit({
        name: name.trim(),
        category,
        date: category === "dated" ? date || undefined : undefined,
        time: category === "dated" ? time || undefined : undefined,
        location: category === "dated" ? location || undefined : undefined,
        note: note || undefined,
        slotsNeeded,
        fields,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-5">
          <Link
            href={`/t/${teamSlug}/admin`}
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm mb-3"
          >
            <ArrowLeft className="size-3.5" />
            Admin
          </Link>
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            {isEdit ? "EDIT LIST" : "NEW LIST"}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">{teamName}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                Name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mowing, Field Prep, Walk-Up Songs"
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
            </div>

            {/* Slug preview */}
            {isEdit && list?.slug && (
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                  Slug (read-only)
                </label>
                <p className="text-sm text-neutral-400 bg-neutral-50 rounded-xl px-3 py-2.5 border border-neutral-100">
                  {list.slug}
                </p>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                Category
              </label>
              <div className="flex gap-2">
                {(["dated", "standalone"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${
                      category === c
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                    }`}
                  >
                    {c === "dated" ? "Dated" : "Standalone"}
                  </button>
                ))}
              </div>
            </div>

            {/* Dated fields */}
            {category === "dated" && (
              <div className="space-y-3 border-t border-neutral-100 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                      Time
                    </label>
                    <input
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 4:00 PM"
                      className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                      Location
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Riverside Field #3"
                      className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                Note (optional)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Game day, Before practice"
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
            </div>

            {/* Slots needed */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                Slots Needed *
              </label>
              <input
                type="number"
                min={1}
                value={slotsNeeded}
                onChange={(e) => setSlotsNeeded(Math.max(1, Number(e.target.value)))}
                className="w-24 h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white tabular-nums"
              />
            </div>

            {/* Entry count context for edits */}
            {isEdit && list && list.entries.length > 0 && (
              <p className="text-xs text-neutral-400">
                This list currently has {list.entries.length} signup
                {list.entries.length === 1 ? "" : "s"}.
              </p>
            )}
          </div>

          {/* Custom field definitions */}
          <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Form Fields
              </h2>
              <button
                type="button"
                onClick={addField}
                className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-500 transition-colors"
              >
                <Plus className="size-3" />
                Add Field
              </button>
            </div>
            {fields.length === 0 && (
              <p className="text-sm text-neutral-400 text-center py-2">
                No fields defined. Add at least one field.
              </p>
            )}
            {fields.map((field, i) => (
              <div
                key={i}
                className="flex items-start gap-2 border border-neutral-100 rounded-xl p-3"
              >
                <div className="flex-1 space-y-2">
                  <input
                    value={field.label}
                    onChange={(e) => updateField(i, { label: e.target.value })}
                    placeholder="Field label"
                    className="w-full h-9 rounded-lg border border-neutral-200 px-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
                  />
                  <div className="flex items-center gap-3">
                    <select
                      value={field.type}
                      onChange={(e) =>
                        updateField(i, {
                          type: e.target.value as "text" | "textarea",
                        })
                      }
                      className="h-8 rounded-lg border border-neutral-200 px-2 text-xs bg-neutral-50"
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                    </select>
                    <label className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(i, { required: e.target.checked })
                        }
                        className="rounded accent-red-600"
                      />
                      Required
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeField(i)}
                  className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-neutral-300 hover:text-red-500 shrink-0 mt-0.5"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="h-11 px-6 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isPending
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create List"}
            </button>
            <Link
              href={`/t/${teamSlug}/admin`}
              className="h-11 px-5 rounded-xl text-neutral-500 text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
