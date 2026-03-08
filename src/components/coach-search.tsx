"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { searchTeamsByCoach } from "@/lib/data";
import type { Team } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function CoachSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Team[] | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResults(null);

    if (!query.trim()) {
      setError("Enter a coach\u2019s last name");
      return;
    }

    const teams = searchTeamsByCoach(query);

    if (teams.length === 1) {
      router.push(`/t/${teams[0].slug}`);
    } else if (teams.length > 1) {
      setResults(teams);
    } else {
      setError("No teams found. Check the spelling and try again.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Coach\u2019s last name"
          className="h-12 bg-secondary/80 border-border text-foreground placeholder:text-muted-foreground text-base px-4 rounded-lg focus-visible:border-primary focus-visible:ring-primary/30"
        />
        <Button
          type="submit"
          className="h-12 w-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
        >
          <Search className="size-5" />
        </Button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-primary/80 animate-fade-up">
          {error}
        </p>
      )}

      {results && results.length > 1 && (
        <div className="mt-4 space-y-2 animate-fade-up">
          <p className="text-sm text-muted-foreground">
            Multiple teams found:
          </p>
          {results.map((team) => (
            <button
              key={team.id}
              onClick={() => router.push(`/t/${team.slug}`)}
              className="w-full text-left p-3 rounded-lg bg-secondary/80 hover:bg-secondary border border-border transition-colors"
            >
              <span className="font-semibold text-foreground">
                {team.name}
              </span>
              <span className="text-muted-foreground text-sm ml-2">
                Coach {team.coachLastName}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
