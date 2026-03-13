"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { searchTeamsAction } from "@/app/actions";
import { Search, ArrowRight } from "lucide-react";

export function CoachSearch() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!query.trim()) {
      setError("Enter a coach\u2019s last name");
      return;
    }

    startTransition(async () => {
      const results = await searchTeamsAction(query);
      if (results.length === 0) {
        setError("No team found \u2014 check the spelling and try again");
        return;
      }
      router.push(`/t/${results[0].slug}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-600 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setError("");
            }}
            placeholder="Coach's last name"
            className="w-full h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] pl-10 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:bg-white/[0.08] transition-all text-base"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="h-12 w-12 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 transition-all flex items-center justify-center disabled:opacity-50 shrink-0 group"
        >
          <ArrowRight className="size-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
      {error && (
        <p
          className="text-red-400/80 text-sm text-left opacity-0 animate-fade-in-up"
          style={{ animationDuration: "0.3s" }}
        >
          {error}
        </p>
      )}
    </form>
  );
}
