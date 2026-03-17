"use client";

import { useState } from "react";
import Link from "next/link";
import type { Team, Player } from "@/lib/types";
import { updateTeamAction, addPlayerAction, removePlayerAction } from "../actions";
import { ArrowLeft, Check, Plus, X as XIcon } from "lucide-react";

export function SettingsForm({
  team,
  players: initialPlayers,
}: {
  team: Team;
  players: Player[];
}) {
  const [name, setName] = useState(team.name);
  const [seasonYear, setSeasonYear] = useState(team.seasonYear.toString());
  const [password, setPassword] = useState(team.adminPassword);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !seasonYear) return;

    setSubmitting(true);
    setSaved(false);

    try {
      await updateTeamAction(team.slug, {
        name: name.trim(),
        seasonYear: parseInt(seasonYear, 10),
        adminPassword: password,
      });
    } catch {
      // redirect() throws a special Next.js error — this is expected
    }

    setSubmitting(false);
    setSaved(true);
  }

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-4">
          <Link
            href={`/${team.slug}/admin`}
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="size-3.5" />
            Dashboard
          </Link>
          <h1 className="font-heading text-3xl tracking-tight leading-none mt-2">
            TEAM SETTINGS
          </h1>
          <p className="text-neutral-500 text-sm">{team.name}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4 space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Team Info
            </h2>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Slug
              </label>
              <input
                value={team.slug}
                readOnly
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm bg-neutral-100 text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Season Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={seasonYear}
                onChange={(e) => setSeasonYear(e.target.value)}
                required
                className="w-32 h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4 space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Security
            </h2>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Admin Password <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
              <p className="text-xs text-neutral-400 mt-1.5">
                Share this password with team admins. It will be replaced by
                proper auth in a future update.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/${team.slug}/admin`}
              className="flex-1 h-11 rounded-xl text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center bg-neutral-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!name.trim() || !seasonYear || !password || submitting}
              className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
            >
              {submitting ? (
                "Saving..."
              ) : saved ? (
                <>
                  <Check className="size-4" /> Saved
                </>
              ) : (
                "Save Settings"
              )}
            </button>
          </div>
        </form>

        {/* Roster */}
        <RosterSection
          teamSlug={team.slug}
          players={players}
          onAdd={(player) =>
            setPlayers((prev) =>
              [...prev, player].sort((a, b) => a.name.localeCompare(b.name))
            )
          }
          onRemove={(id) =>
            setPlayers((prev) => prev.filter((p) => p.id !== id))
          }
        />
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Roster management                                                  */
/* ------------------------------------------------------------------ */

function RosterSection({
  teamSlug,
  players,
  onAdd,
  onRemove,
}: {
  teamSlug: string;
  players: Player[];
  onAdd: (player: Player) => void;
  onRemove: (id: string) => void;
}) {
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    const player = await addPlayerAction(teamSlug, newName.trim());
    onAdd({ id: player.id, teamId: "", name: player.name });
    setNewName("");
    setAdding(false);
  }

  async function handleRemove(id: string) {
    onRemove(id);
    await removePlayerAction(teamSlug, id);
  }

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4 space-y-4">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
        Roster ({players.length})
      </h2>

      {players.length === 0 && (
        <p className="text-sm text-neutral-500 text-center py-2">
          No players added yet. Add players to auto-populate walk-up song lists.
        </p>
      )}

      {players.length > 0 && (
        <div className="space-y-1.5">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-2 h-9 px-3 rounded-lg bg-neutral-50 group"
            >
              <span className="flex-1 text-sm text-neutral-800 truncate">
                {player.name}
              </span>
              <button
                onClick={() => handleRemove(player.id)}
                className="size-6 rounded flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove"
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Player name"
          className="flex-1 h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!newName.trim() || adding}
          className="h-9 px-3 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
        >
          <Plus className="size-4" />
        </button>
      </form>
    </div>
  );
}
