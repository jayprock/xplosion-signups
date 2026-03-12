"use client";

import { useState, useTransition } from "react";
import type { Team } from "@/lib/types";
import { updateTeamAction } from "../actions";

export function SettingsForm({
  teamSlug,
  team,
}: {
  teamSlug: string;
  team: Team;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateTeamAction(teamSlug, formData);
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

      <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-5 space-y-4">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          Team Info
        </h3>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Team Name *
          </label>
          <input
            name="name"
            defaultValue={team.name}
            required
            className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Coach Last Name
          </label>
          <input
            name="coachLastName"
            defaultValue={team.coachLastName}
            className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Season Year *
          </label>
          <input
            name="seasonYear"
            type="number"
            defaultValue={team.seasonYear}
            required
            className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Slug
          </label>
          <input
            value={team.slug}
            disabled
            className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm bg-neutral-100 text-neutral-500 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-5 space-y-4">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          Security
        </h3>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Admin Password *
          </label>
          <input
            name="adminPassword"
            type="password"
            defaultValue={team.adminPassword}
            required
            className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
          />
          <p className="text-xs text-neutral-400 mt-1.5">
            Used to access admin pages for this team
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-12 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isPending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
