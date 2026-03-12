"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import { Lock } from "lucide-react";

export function LoginForm({ teamSlug }: { teamSlug: string }) {
  const loginWithTeam = loginAction.bind(null, teamSlug);
  const [state, formAction, isPending] = useActionState(loginWithTeam, null);

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="size-11 rounded-xl bg-neutral-100 flex items-center justify-center">
          <Lock className="size-5 text-neutral-400" />
        </div>
        <div>
          <h2 className="font-semibold text-neutral-900">Admin Access</h2>
          <p className="text-sm text-neutral-500">
            Enter the team password to continue
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <input
            name="password"
            type="password"
            placeholder="Team password"
            required
            autoFocus
            className="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-neutral-50 focus:bg-white"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-600 font-medium">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
