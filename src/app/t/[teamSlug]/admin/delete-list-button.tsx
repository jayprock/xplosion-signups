"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteListAction } from "./actions";

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
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const warning =
      entryCount > 0
        ? `"${listName}" has ${entryCount} signup${entryCount === 1 ? "" : "s"}. Are you sure you want to delete it?`
        : `Delete "${listName}"?`;

    if (!window.confirm(warning)) return;

    startTransition(async () => {
      await deleteListAction(teamSlug, listId);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="size-9 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-neutral-300 hover:text-red-500 disabled:opacity-50"
      title="Delete"
    >
      <Trash2 className="size-3.5" />
    </button>
  );
}
