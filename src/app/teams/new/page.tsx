"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTeamAction } from "./actions";
import { ArrowLeft } from "lucide-react";

export default function NewTeamPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [coachLastName, setCoachLastName] = useState("");
  const [seasonYear, setSeasonYear] = useState(
    new Date().getFullYear().toString()
  );
  const [adminPassword, setAdminPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !coachLastName.trim() || !seasonYear || !adminPassword)
      return;

    setSubmitting(true);

    const result = await createTeamAction({
      name: name.trim(),
      coachLastName: coachLastName.trim(),
      seasonYear: parseInt(seasonYear, 10),
      adminPassword,
    });

    if (result.teamSlug) {
      router.push(`/t/${result.teamSlug}/admin`);
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="size-3.5" />
            Home
          </Link>
          <h1 className="font-heading text-3xl tracking-tight leading-none mt-2">
            NEW TEAM
          </h1>
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
                placeholder="e.g., 12U Xplosion"
                required
                autoFocus
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Coach Last Name <span className="text-red-500">*</span>
              </label>
              <input
                value={coachLastName}
                onChange={(e) => setCoachLastName(e.target.value)}
                placeholder="e.g., Smith"
                required
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
              <p className="text-xs text-neutral-400 mt-1.5">
                Parents will search by this name to find the team.
              </p>
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
                Team Admin Password <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Choose a password for this team's admin"
                required
                className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
              />
              <p className="text-xs text-neutral-400 mt-1.5">
                Share this with anyone who needs to manage signup lists for this
                team.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 h-11 rounded-xl text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center bg-neutral-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={
                !name.trim() ||
                !coachLastName.trim() ||
                !seasonYear ||
                !adminPassword ||
                submitting
              }
              className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? "Creating..." : "Create Team"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
