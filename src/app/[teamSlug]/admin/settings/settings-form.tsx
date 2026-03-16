"use client";

import { useState } from "react";
import Link from "next/link";
import type { Team } from "@/lib/types";
import { updateTeamAction } from "../actions";
import { ArrowLeft, Check } from "lucide-react";

export function SettingsForm({ team }: { team: Team }) {
  const [name, setName] = useState(team.name);
  const [seasonYear, setSeasonYear] = useState(team.seasonYear.toString());
  const [password, setPassword] = useState(team.adminPassword);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !seasonYear) return;

    setSubmitting(true);
    setSaved(false);

    await updateTeamAction(team.slug, {
      name: name.trim(),
      seasonYear: parseInt(seasonYear, 10),
      adminPassword: password,
    });

    // redirect happens in server action, but in case it doesn't:
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

      <main className="max-w-lg mx-auto px-4 py-6">
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
      </main>
    </div>
  );
}
