"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Users, ClipboardList, Music } from "lucide-react";
import { searchTeamsByCoach } from "@/lib/data";
import type { Team } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Team[] | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    const teams = searchTeamsByCoach(query.trim());
    if (teams.length === 1) {
      router.push(`/t/${teams[0].slug}`);
    } else if (teams.length > 1) {
      setResults(teams);
      setNoResults(false);
    } else {
      setResults(null);
      setNoResults(true);
    }
  }

  function handleTeamClick(slug: string) {
    startTransition(() => {
      router.push(`/t/${slug}`);
    });
  }

  return (
    <div className="relative min-h-dvh bg-[oklch(0.08_0_0)] overflow-hidden">
      {/* Background diagonal slash */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 60px, oklch(0.58 0.23 25) 60px, oklch(0.58 0.23 25) 61px)",
        }}
      />

      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[oklch(0.58_0.23_25)] via-[oklch(0.65_0.20_30)] to-[oklch(0.58_0.23_25)]" />

      <main className="relative flex min-h-[calc(100dvh-4px)] flex-col items-center justify-center px-6 py-16">
        {/* Hero Section */}
        <div className="w-full max-w-md text-center animate-slide-up-fade">
          {/* Logo mark */}
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-lg bg-[oklch(0.58_0.23_25)] shadow-[0_0_40px_oklch(0.58_0.23_25_/_0.3)]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8 text-white"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12c2.4 3.6 6 5.8 10 5.8s7.6-2.2 10-5.8" />
              <path d="M2 12c2.4-3.6 6-5.8 10-5.8s7.6 2.2 10 5.8" />
            </svg>
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-4xl font-900 uppercase tracking-tight text-white">
            Team
            <span className="text-[oklch(0.62_0.23_25)]">SignUp</span>
          </h1>
          <p className="mt-3 text-base font-500 text-[oklch(0.55_0_0)]">
            Travel baseball team management.
            <br />
            Volunteer duties. Walk-up songs. One link.
          </p>
        </div>

        {/* Search Section */}
        <div className="mt-10 w-full max-w-md animate-slide-up-fade stagger-2">
          <form onSubmit={handleSearch} className="relative">
            <label
              htmlFor="coach-search"
              className="mb-2.5 block text-xs font-700 uppercase tracking-widest text-[oklch(0.50_0_0)]"
            >
              Find your team
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[oklch(0.40_0_0)]" />
              <input
                id="coach-search"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setNoResults(false);
                  setResults(null);
                }}
                placeholder="Enter your coach's last name"
                autoComplete="off"
                className="h-14 w-full rounded-lg border border-[oklch(1_0_0_/_0.08)] bg-[oklch(0.13_0_0)] pl-12 pr-14 text-base font-600 text-white placeholder:text-[oklch(0.35_0_0)] focus:border-[oklch(0.58_0.23_25)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.58_0.23_25_/_0.25)] transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-[oklch(0.58_0.23_25)] text-white transition-all hover:bg-[oklch(0.52_0.23_25)] active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* No results */}
          {noResults && (
            <div className="mt-4 rounded-lg border border-[oklch(0.58_0.23_25_/_0.2)] bg-[oklch(0.58_0.23_25_/_0.05)] p-4 text-center">
              <p className="text-sm font-600 text-[oklch(0.62_0.23_25)]">
                No teams found for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-[oklch(0.45_0_0)]">
                Check the spelling and try again
              </p>
            </div>
          )}

          {/* Multiple results */}
          {results && results.length > 1 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-700 uppercase tracking-widest text-[oklch(0.50_0_0)]">
                {results.length} teams found
              </p>
              {results.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamClick(team.slug)}
                  className="flex w-full items-center justify-between rounded-lg border border-[oklch(1_0_0_/_0.08)] bg-[oklch(0.13_0_0)] p-4 text-left transition-all hover:border-[oklch(0.58_0.23_25_/_0.3)] hover:bg-[oklch(0.15_0.005_15)]"
                >
                  <div>
                    <p className="text-sm font-700 text-white">{team.name}</p>
                    <p className="text-xs text-[oklch(0.45_0_0)]">
                      Coach {team.coachLastName} &middot; {team.seasonYear}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[oklch(0.40_0_0)]" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid w-full max-w-md grid-cols-3 gap-4 animate-slide-up-fade stagger-4">
          {[
            { icon: Users, label: "Volunteer\nSign-ups" },
            { icon: ClipboardList, label: "Game Day\nDuties" },
            { icon: Music, label: "Walk-Up\nSongs" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-lg border border-[oklch(1_0_0_/_0.05)] bg-[oklch(0.12_0_0)] p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[oklch(0.58_0.23_25_/_0.1)]">
                <Icon className="h-5 w-5 text-[oklch(0.62_0.23_25)]" />
              </div>
              <p className="text-center text-[11px] font-700 uppercase leading-tight tracking-wider text-[oklch(0.45_0_0)] whitespace-pre-line">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Coach CTA */}
        <div className="mt-12 w-full max-w-md animate-slide-up-fade stagger-6">
          <div className="relative overflow-hidden rounded-lg border border-[oklch(1_0_0_/_0.06)] bg-[oklch(0.12_0_0)] p-5">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[oklch(0.58_0.23_25_/_0.06)]" />
            <p className="text-sm font-700 text-white">Are you a coach?</p>
            <p className="mt-1 text-xs text-[oklch(0.45_0_0)]">
              Set up your team and manage sign-up lists in minutes.
            </p>
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[oklch(0.58_0.23_25_/_0.3)] px-3 py-1.5 text-xs font-700 text-[oklch(0.62_0.23_25)] transition-all hover:bg-[oklch(0.58_0.23_25_/_0.1)]">
              Get Started
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-[10px] font-600 uppercase tracking-[0.2em] text-[oklch(0.30_0_0)]">
            TeamSignUp &middot; {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
