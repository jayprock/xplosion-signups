"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { siteAdminLoginAction } from "./actions";
import { Lock, ArrowLeft } from "lucide-react";

export default function SiteAdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await siteAdminLoginAction(password);

    if (result.success) {
      router.push("/teams/new");
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-white flex flex-col">
      <div className="h-1 w-full bg-gradient-to-r from-red-900 via-red-500 to-red-900" />

      <div className="max-w-lg mx-auto px-4 py-4 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="size-3.5" />
          Home
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Lock className="size-6 text-red-500" />
            </div>
            <h1 className="font-heading text-4xl tracking-tight">
              SITE ADMIN
            </h1>
            <p className="text-neutral-500 text-sm mt-2">
              Enter the site admin password to add a new team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Site admin password"
                autoFocus
                className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!password || loading}
              className="w-full h-12 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 active:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
