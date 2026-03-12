"use client";

import { useState, useTransition } from "react";
import { Lock } from "lucide-react";
import { loginAction } from "../actions";

export function LoginForm({ teamSlug }: { teamSlug: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await loginAction(teamSlug, password);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Team password"
          autoFocus
          className="w-full h-12 rounded-xl border border-neutral-800 bg-neutral-900 pl-10 pr-4 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}
      <button
        type="submit"
        disabled={!password || isPending}
        className="w-full h-12 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
