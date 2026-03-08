"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchTeamsByCoach } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!query.trim()) {
      setError("Enter your coach's last name");
      return;
    }
    setIsSearching(true);
    const results = searchTeamsByCoach(query.trim());
    if (results.length === 0) {
      setError("No team found. Check the spelling and try again.");
      setIsSearching(false);
      return;
    }
    router.push(`/t/${results[0].slug}`);
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background: black with subtle diagonal red stripes */}
      <div className="absolute inset-0 stripe-pattern" />

      {/* Decorative diagonal bar */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-xred/5 rotate-12 rounded-3xl" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-xred/3 -rotate-12 rounded-3xl" />

      {/* Header */}
      <header className="relative z-10 px-5 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-xred rounded-sm flex items-center justify-center -skew-x-6">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-widest uppercase text-zinc-400">
            Xplosion
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-5 pb-24">
        <div className="max-w-lg mx-auto w-full">
          {/* Hero text */}
          <div className="mb-10 animate-slide-up">
            <div className="inline-block mb-4">
              <span className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-xred bg-xred/10 px-3 py-1.5 rounded-sm">
                Travel Baseball Sign-Ups
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
              <span className="text-white">Find your</span>
              <br />
              <span className="text-xred">team.</span>
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
              Sign up for game-day duties, submit walk-up songs, and stay on top
              of what your team needs.
            </p>
          </div>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                <Search className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Coach's last name"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError("");
                }}
                className="h-14 pl-12 pr-14 text-base bg-zinc-900/80 border-zinc-700/50 rounded-xl text-white placeholder:text-zinc-500 focus:border-xred focus:ring-xred/30 transition-all"
                autoFocus
              />
              <Button
                type="submit"
                size="icon-lg"
                disabled={isSearching}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-xred hover:bg-xred-dark text-white rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                {error}
              </p>
            )}
            <p className="mt-4 text-xs text-zinc-600">
              Try &quot;Smith&quot; to see the demo team
            </p>
          </form>
        </div>
      </main>

      {/* Footer CTA for coaches */}
      <footer
        className="relative z-10 px-5 pb-8 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="max-w-lg mx-auto w-full">
          <div className="border border-zinc-800 rounded-xl p-4 flex items-center justify-between bg-zinc-900/40 backdrop-blur-sm">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                Are you a coach?
              </p>
              <p className="text-xs text-zinc-500">
                Set up sign-ups for your team
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:text-white hover:border-xred/50"
              disabled
            >
              Coming Soon
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
