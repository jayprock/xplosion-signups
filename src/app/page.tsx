"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Users, ClipboardList, Music } from "lucide-react";
import { searchTeamsByCoach } from "@/lib/data";
import type { Team } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Team[]>([]);
  const [searched, setSearched] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const found = searchTeamsByCoach(query);
    setResults(found);
    setSearched(true);
    if (found.length === 1) {
      router.push(`/t/${found[0].slug}`);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background relative overflow-hidden">
      {/* Diagonal red accent stripe */}
      <div className="absolute top-0 right-0 w-[200%] h-1 bg-team-red" />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-16 relative z-10">
        {/* Logo mark */}
        <div className="mb-8 animate-slide-up">
          <div className="w-16 h-16 bg-team-red rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-team-red/20">
            <span className="text-white font-bold text-2xl -rotate-3 tracking-tighter">
              TS
            </span>
          </div>
        </div>

        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight text-center leading-[1.1] animate-slide-up"
          style={{ animationDelay: "0.05s" }}
        >
          Team
          <span className="text-team-red">SignUp</span>
        </h1>

        <p
          className="mt-4 text-muted-foreground text-center text-base sm:text-lg max-w-md leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Game-day volunteer duties, walk-up songs, and everything your travel
          baseball team needs — all in one place.
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="mt-10 w-full max-w-sm animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 text-center">
            Find your team
          </label>
          <div
            className={`relative flex items-center rounded-xl border transition-all duration-200 ${
              focusedInput
                ? "border-team-red ring-3 ring-team-red/20 bg-card"
                : "border-border bg-card"
            }`}
          >
            <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
              placeholder="Enter your coach's last name..."
              className="flex-1 bg-transparent px-10 py-3.5 text-sm placeholder:text-muted-foreground outline-none"
              autoComplete="off"
            />
            <button
              type="submit"
              className="absolute right-2 bg-team-red hover:bg-red-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              Search
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </form>

        {/* Search results */}
        {searched && results.length === 0 && (
          <div className="mt-4 text-sm text-muted-foreground animate-fade-in">
            No teams found for &ldquo;{query}&rdquo;. Check the spelling and try
            again.
          </div>
        )}

        {searched && results.length > 1 && (
          <div className="mt-4 w-full max-w-sm space-y-2 animate-fade-in">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              {results.length} teams found
            </p>
            {results.map((team) => (
              <button
                key={team.id}
                onClick={() => router.push(`/t/${team.slug}`)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-left group"
              >
                <div>
                  <div className="font-semibold text-sm">{team.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Coach {team.coachLastName} &middot; {team.seasonYear}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-team-red transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Feature highlights */}
        <div
          className="mt-16 grid grid-cols-3 gap-4 w-full max-w-sm animate-slide-up"
          style={{ animationDelay: "0.25s" }}
        >
          {[
            { icon: ClipboardList, label: "Volunteer Duties" },
            { icon: Music, label: "Walk-Up Songs" },
            { icon: Users, label: "Team Roster" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 py-4 rounded-xl bg-card border border-border/50"
            >
              <Icon className="w-5 h-5 text-team-red" />
              <span className="text-[11px] font-medium text-muted-foreground text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Coach CTA footer */}
      <footer
        className="py-6 px-5 border-t border-border/50 animate-slide-up"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="max-w-sm mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Are you a coach?{" "}
            <button className="text-team-red font-semibold hover:underline underline-offset-2 transition-colors">
              Add your team &rarr;
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
}
