"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateTeamAction } from "../actions";

export function SettingsForm({
  teamSlug,
  teamName,
  teamSeasonYear,
  teamAdminPassword,
}: {
  teamSlug: string;
  teamName: string;
  teamSeasonYear: number;
  teamAdminPassword: string;
}) {
  const [name, setName] = useState(teamName);
  const [seasonYear, setSeasonYear] = useState(teamSeasonYear);
  const [adminPassword, setAdminPassword] = useState(teamAdminPassword);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Team name is required");
      return;
    }
    if (!adminPassword.trim()) {
      setError("Admin password is required");
      return;
    }

    startTransition(async () => {
      const result = await updateTeamAction(teamSlug, {
        name: name.trim(),
        seasonYear,
        adminPassword: adminPassword.trim(),
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
            TEAM SETTINGS
          </h1>
          <p className="text-neutral-500 text-sm mt-1">{teamName}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4 space-y-4">
            {/* Slug (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                Slug (read-only)
              </label>
              <p className="text-sm text-neutral-400 bg-neutral-50 rounded-xl px-3 py-2.5 border border-neutral-100">
                {teamSlug}
              </p>
            </div>

            {/* Team name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                Team Name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
            </div>

            {/* Season year */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                Season Year
              </label>
              <input
                type="number"
                value={seasonYear}
                onChange={(e) => setSeasonYear(Number(e.target.value))}
                className="w-28 h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white tabular-nums"
              />
            </div>

            {/* Admin password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                Admin Password *
              </label>
              <input
                type="text"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white font-mono"
              />
              <p className="text-xs text-neutral-400 mt-1">
                Share this password with coaches who need admin access.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="h-11 px-6 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isPending ? "Saving..." : "Save Settings"}
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
