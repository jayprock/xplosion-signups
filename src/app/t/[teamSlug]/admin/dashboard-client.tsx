"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Team, SignupList, ListStatus } from "@/lib/types";
import { deleteListAction } from "./actions";
import {
  Plus,
  Pencil,
  Trash2,
  Settings,
  ArrowLeft,
  Calendar,
  List,
  ExternalLink,
  AlertTriangle,
  Music,
} from "lucide-react";

type ListWithStatus = SignupList & { status: ListStatus };

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function AdminDashboardClient({
  team,
  lists,
}: {
  team: Team;
  lists: ListWithStatus[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ListWithStatus | null>(
    null
  );

  async function handleDelete(list: ListWithStatus) {
    setDeleting(list.id);
    await deleteListAction(team.slug, list.id);
    setConfirmDelete(null);
    setDeleting(null);
    router.refresh();
  }

  const dated = lists
    .filter((l) => l.category === "dated")
    .sort(
      (a, b) =>
        new Date(a.date || "").getTime() - new Date(b.date || "").getTime()
    );
  const standalone = lists.filter((l) => l.category === "standalone");

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
            Team Page
          </Link>
          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="font-heading text-3xl tracking-tight leading-none">
                ADMIN
              </h1>
              <p className="text-neutral-500 text-sm">{team.name}</p>
            </div>
            <Link
              href={`/t/${team.slug}/admin/settings`}
              className="size-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <Settings className="size-4 text-neutral-400" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Actions bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
            Signup Lists ({lists.length})
          </h2>
          <Link
            href={`/t/${team.slug}/admin/lists/new`}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 transition-all"
          >
            <Plus className="size-3.5" />
            New List
          </Link>
        </div>

        {/* Empty state */}
        {lists.length === 0 && (
          <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-8 text-center">
            <div className="size-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
              <List className="size-5 text-neutral-400" />
            </div>
            <p className="font-semibold text-neutral-900">No signup lists yet</p>
            <p className="text-sm text-neutral-500 mt-1">
              Create your first signup list to get started.
            </p>
            <Link
              href={`/t/${team.slug}/admin/lists/new`}
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-all mt-4"
            >
              <Plus className="size-3.5" />
              Create List
            </Link>
          </div>
        )}

        {/* Dated lists */}
        {dated.length > 0 && (
          <div className="space-y-3">
            {dated.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                teamSlug={team.slug}
                deleting={deleting === list.id}
                onDelete={() => setConfirmDelete(list)}
              />
            ))}
          </div>
        )}

        {/* Standalone lists */}
        {standalone.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
              Standalone Lists
            </h3>
            {standalone.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                teamSlug={team.slug}
                deleting={deleting === list.id}
                onDelete={() => setConfirmDelete(list)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="size-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-neutral-900">Delete list?</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-1">
              Are you sure you want to delete &ldquo;{confirmDelete.name}&rdquo;
              {confirmDelete.date && ` (${formatDate(confirmDelete.date)})`}?
            </p>
            {confirmDelete.entries.length > 0 && (
              <p className="text-sm text-red-600 font-medium mb-4">
                This list has {confirmDelete.entries.length} signup
                {confirmDelete.entries.length !== 1 ? "s" : ""} that will be
                lost.
              </p>
            )}
            {confirmDelete.entries.length === 0 && <div className="mb-4" />}
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 h-10 rounded-xl text-neutral-700 text-sm font-medium hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete.id}
                className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 disabled:opacity-40 transition-all"
              >
                {deleting === confirmDelete.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  List card                                                          */
/* ------------------------------------------------------------------ */

function isWalkUpSong(list: ListWithStatus): boolean {
  return (
    list.category === "standalone" &&
    list.fields.some((f) => f.key === "songName")
  );
}

function ListCard({
  list,
  teamSlug,
  deleting,
  onDelete,
}: {
  list: ListWithStatus;
  teamSlug: string;
  deleting: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4">
      <div className="flex items-start gap-3">
        <div
          className={`size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            isWalkUpSong(list) ? "bg-red-50" : "bg-neutral-100"
          }`}
        >
          {isWalkUpSong(list) ? (
            <Music className="size-4 text-red-500" />
          ) : list.category === "dated" ? (
            <Calendar className="size-4 text-neutral-400" />
          ) : (
            <List className="size-4 text-neutral-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-900 truncate">
            {list.name}
          </p>
          <div className="flex items-center gap-3 mt-1">
            {list.date && (
              <span className="text-xs text-neutral-500">
                {formatDate(list.date)}
              </span>
            )}
            <span
              className={`text-xs font-medium ${
                list.status.level === "complete"
                  ? "text-emerald-600"
                  : "text-neutral-500"
              }`}
            >
              {list.status.filled}/{list.status.total} filled
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
        <Link
          href={`/t/${teamSlug}/${list.slug}`}
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <ExternalLink className="size-3" />
          View
        </Link>
        <div className="flex-1" />
        <Link
          href={`/t/${teamSlug}/admin/lists/${list.slug}/edit`}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <Pencil className="size-3" />
          Edit
        </Link>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
        >
          <Trash2 className="size-3" />
          Delete
        </button>
      </div>
    </div>
  );
}
