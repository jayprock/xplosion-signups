"use client";

import { useState, useTransition } from "react";
import { deleteListAction } from "./actions";
import { Trash2 } from "lucide-react";

export function DeleteListButton({
  teamSlug,
  listId,
  listName,
  entryCount,
}: {
  teamSlug: string;
  listId: string;
  listName: string;
  entryCount: number;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600 font-medium">
          {entryCount > 0
            ? `Delete "${listName}"? (${entryCount} signup${entryCount === 1 ? "" : "s"} will be lost)`
            : `Delete "${listName}"?`}
        </span>
        <button
          onClick={() => {
            startTransition(async () => {
              await deleteListAction(teamSlug, listId);
            });
          }}
          disabled={isPending}
          className="h-8 px-3 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500 disabled:opacity-50 transition-all"
        >
          {isPending ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="h-8 px-3 rounded-lg text-neutral-500 text-xs font-medium hover:bg-neutral-100 transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="size-9 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-neutral-400 hover:text-red-500"
      title="Delete"
    >
      <Trash2 className="size-4" />
    </button>
  );
}
