"use client";

import { useState, useTransition } from "react";
import type { SignupList, FieldDefinition } from "@/lib/types";
import { Plus, X as XIcon } from "lucide-react";

type ListFormProps = {
  teamSlug: string;
  initialData?: SignupList;
  action: (teamSlug: string, formData: FormData) => Promise<{ error: string } | null>;
  actionWithId?: (teamSlug: string, listId: string, formData: FormData) => Promise<{ error: string } | null>;
  submitLabel: string;
};

export function ListForm({
  teamSlug,
  initialData,
  action,
  actionWithId,
  submitLabel,
}: ListFormProps) {
  const [category, setCategory] = useState<"dated" | "standalone">(
    initialData?.category ?? "dated"
  );
  const [fields, setFields] = useState<FieldDefinition[]>(
    initialData?.fields ?? [
      { key: "name", label: "Your Name", type: "text", required: true },
    ]
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function addField() {
    setFields((prev) => [
      ...prev,
      {
        key: `field_${Date.now()}`,
        label: "",
        type: "text",
        required: false,
      },
    ]);
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  function updateField(
    index: number,
    updates: Partial<FieldDefinition>
  ) {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== index) return f;
        const updated = { ...f, ...updates };
        // Auto-generate key from label
        if (updates.label !== undefined) {
          updated.key = updates.label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_|_$/g, "") || `field_${index}`;
        }
        return updated;
      })
    );
  }

  function handleSubmit(formData: FormData) {
    formData.set("fields", JSON.stringify(fields));
    formData.set("category", category);

    startTransition(async () => {
      let result: { error: string } | null = null;
      if (initialData && actionWithId) {
        result = await actionWithId(teamSlug, initialData.id, formData);
      } else {
        result = await action(teamSlug, formData);
      }
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm font-medium rounded-xl p-3">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-5 space-y-4">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          Basic Info
        </h3>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            List Name *
          </label>
          <input
            name="name"
            defaultValue={initialData?.name ?? ""}
            required
            placeholder="e.g. Mowing, Snack Duty, Walk-Up Songs"
            className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
          />
        </div>

        {initialData && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Slug
            </label>
            <input
              value={initialData.slug}
              disabled
              className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm bg-neutral-100 text-neutral-500 cursor-not-allowed"
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
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Date
              </label>
              <input
                name="date"
                type="date"
                defaultValue={initialData?.date ?? ""}
                className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Time
                </label>
                <input
                  name="time"
                  defaultValue={initialData?.time ?? ""}
                  placeholder="e.g. 4:00 PM"
                  className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Location
                </label>
                <input
                  name="location"
                  defaultValue={initialData?.location ?? ""}
                  placeholder="e.g. Riverside Field"
                  className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Note (optional)
          </label>
          <input
            name="note"
            defaultValue={initialData?.note ?? ""}
            placeholder="e.g. Game vs Thunder, Before practice"
            className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
          />
        </div>

        {/* Slots needed */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Slots Needed *
          </label>
          <input
            name="slotsNeeded"
            type="number"
            min="1"
            defaultValue={initialData?.slotsNeeded ?? 1}
            required
            className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Custom field definitions */}
      <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Form Fields
          </h3>
          <button
            type="button"
            onClick={addField}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-500 transition-colors"
          >
            <Plus className="size-3.5" />
            Add Field
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-neutral-400 py-2">
            No fields defined. Add at least one field for signups.
          </p>
        )}

        {fields.map((field, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50"
          >
            <div className="flex-1 space-y-2">
              <input
                value={field.label}
                onChange={(e) => updateField(i, { label: e.target.value })}
                placeholder="Field label"
                className="w-full h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-white"
              />
              <div className="flex items-center gap-3">
                <select
                  value={field.type}
                  onChange={(e) =>
                    updateField(i, {
                      type: e.target.value as "text" | "textarea",
                    })
                  }
                  className="h-8 rounded-lg border border-neutral-200 px-2 text-xs bg-white focus:outline-none focus:border-red-500"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                </select>
                <label className="flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      updateField(i, { required: e.target.checked })
                    }
                    className="rounded"
                  />
                  Required
                </label>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeField(i)}
              className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-neutral-400 hover:text-red-500 shrink-0 mt-0.5"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Submit */}
      {initialData && (
        <p className="text-xs text-neutral-400 px-1">
          Current signups: {initialData.entries.length}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full h-12 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
