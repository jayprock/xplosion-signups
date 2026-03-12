"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { FieldDefinition, SignupList, SignupListCategory } from "@/lib/types";
import { createListAction, updateListAction } from "./actions";
import type { CreateListInput } from "./actions";
import { ArrowLeft, Plus, Trash2, Repeat } from "lucide-react";

type ListFormProps = {
  teamSlug: string;
  teamName: string;
} & (
  | { mode: "create" }
  | { mode: "edit"; list: SignupList }
);

function labelToKey(label: string): string {
  const words = label.trim().toLowerCase().split(/\s+/);
  if (words.length === 0 || (words.length === 1 && words[0] === ""))
    return "field";
  return words
    .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join("");
}

export function ListForm(props: ListFormProps) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const initial = isEdit ? props.list : null;

  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState<SignupListCategory>(
    initial?.category || "dated"
  );
  const [date, setDate] = useState(initial?.date || "");
  const [time, setTime] = useState(initial?.time || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [note, setNote] = useState(initial?.note || "");
  const [slotsNeeded, setSlotsNeeded] = useState(
    initial?.slotsNeeded?.toString() || "1"
  );
  const [fields, setFields] = useState<FieldDefinition[]>(
    initial?.fields || [
      { key: "name", label: "Your Name", type: "text", required: true },
    ]
  );
  const [recurring, setRecurring] = useState(false);
  const [untilDate, setUntilDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function addField() {
    setFields((prev) => [
      ...prev,
      { key: `field-${Date.now()}`, label: "", type: "text", required: false },
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
        if (updates.label !== undefined) {
          updated.key = labelToKey(updates.label);
        }
        return updated;
      })
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slotsNeeded) return;

    setSubmitting(true);

    const data: CreateListInput = {
      name: name.trim(),
      category,
      date: category === "dated" ? date || undefined : undefined,
      time: category === "dated" ? time || undefined : undefined,
      location: category === "dated" ? location || undefined : undefined,
      note: note || undefined,
      slotsNeeded: parseInt(slotsNeeded, 10),
      fields: fields.filter((f) => f.label.trim() !== ""),
      recurring:
        !isEdit && recurring && category === "dated" && untilDate
          ? { untilDate }
          : undefined,
    };

    if (isEdit) {
      await updateListAction(props.teamSlug, props.list.id, data);
    } else {
      await createListAction(props.teamSlug, data);
    }
    // redirect happens in server action
  }

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-4">
          <Link
            href={`/t/${props.teamSlug}/admin`}
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="size-3.5" />
            Dashboard
          </Link>
          <h1 className="font-heading text-3xl tracking-tight leading-none mt-2">
            {isEdit ? "EDIT LIST" : "NEW LIST"}
          </h1>
          <p className="text-neutral-500 text-sm">{props.teamName}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4 space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Basics
            </h2>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                List Name <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Mowing, Snack Duty, Walk-Up Songs"
                required
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
            </div>

            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Slug
                </label>
                <input
                  value={initial?.slug}
                  readOnly
                  className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm bg-neutral-100 text-neutral-500 cursor-not-allowed"
                />
              </div>
            )}

            {/* Category toggle */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Category
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCategory("dated")}
                  className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${
                    category === "dated"
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  Dated
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("standalone")}
                  className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${
                    category === "standalone"
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  Standalone
                </button>
              </div>
            </div>

            {/* Dated fields */}
            {category === "dated" && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Time
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g., 4:00 PM"
                      className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Riverside Field #3"
                    className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
                  />
                </div>

                {/* Recurring toggle (create mode only) */}
                {!isEdit && (
                  <div className="pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <div
                        onClick={() => setRecurring(!recurring)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${
                          recurring ? "bg-red-600" : "bg-neutral-200"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                            recurring ? "translate-x-4" : ""
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Repeat className="size-3.5 text-neutral-500" />
                        <span className="text-sm font-medium text-neutral-700">
                          Repeat weekly
                        </span>
                      </div>
                    </label>

                    {recurring && (
                      <div className="mt-3 ml-[52px]">
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Until
                        </label>
                        <input
                          type="date"
                          value={untilDate}
                          onChange={(e) => setUntilDate(e.target.value)}
                          min={date || undefined}
                          className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
                        />
                        {date && untilDate && (
                          <p className="text-xs text-neutral-500 mt-1.5">
                            This will create{" "}
                            <span className="font-semibold text-neutral-700">
                              {Math.max(
                                1,
                                Math.floor(
                                  (new Date(untilDate + "T12:00:00").getTime() -
                                    new Date(date + "T12:00:00").getTime()) /
                                    (7 * 24 * 60 * 60 * 1000)
                                ) + 1
                              )}
                            </span>{" "}
                            lists, one per week.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Note <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Game day, Before practice"
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
            </div>

            {/* Slots */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Slots Needed <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={slotsNeeded}
                onChange={(e) => setSlotsNeeded(e.target.value)}
                required
                className="w-24 h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Custom fields */}
          <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4 space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Form Fields
            </h2>

            {fields.length === 0 && (
              <p className="text-sm text-neutral-500 text-center py-4">
                No fields defined. Add at least one field.
              </p>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 ring-1 ring-black/[0.04]"
                >
                  <div className="flex-1">
                    <input
                      value={field.label}
                      onChange={(e) =>
                        updateField(index, { label: e.target.value })
                      }
                      placeholder="Field label"
                      className="w-full h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-white"
                    />
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        updateField(index, { required: e.target.checked })
                      }
                      className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
                    />
                    Required
                  </label>
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-neutral-300 hover:text-red-500 shrink-0"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addField}
              className="w-full h-10 rounded-xl border-2 border-dashed border-neutral-200 text-sm font-medium text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 hover:bg-neutral-50 transition-all inline-flex items-center justify-center gap-1.5"
            >
              <Plus className="size-4" />
              Add Field
            </button>
          </div>

          {/* Show signup count for edit mode */}
          {isEdit && (
            <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4">
              <p className="text-sm text-neutral-600">
                <span className="font-semibold text-neutral-900">
                  {initial?.entries.length || 0}
                </span>{" "}
                current signup{(initial?.entries.length || 0) !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <Link
              href={`/t/${props.teamSlug}/admin`}
              className="flex-1 h-11 rounded-xl text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center bg-neutral-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!name.trim() || !slotsNeeded || submitting}
              className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {submitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                ? "Save Changes"
                : "Create List"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
