import Link from "next/link";
import { CoachSearch } from "@/components/coach-search";

export default function Home() {
  return (
    <div className="min-h-dvh bg-neutral-950 text-white flex flex-col overflow-hidden">
      {/* Red accent stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-red-900 via-red-500 to-red-900" />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative">
        {/* Atmospheric red glow — diagonal slash */}
        <div
          className="absolute top-[8%] -left-[20%] w-[140%] h-64 bg-red-600/[0.06] -rotate-12 blur-[100px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        {/* Giant X watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span className="font-heading text-[min(50vw,24rem)] text-white/[0.02] leading-none">
            X
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center w-full max-w-md">
          {/* Hero headline */}
          <h1
            className="font-heading text-6xl sm:text-8xl leading-[0.85] tracking-tight mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="text-red-500">XPLOSION</span>
            <br />
            SIGNUPS
          </h1>

          {/* Subtitle */}
          <p
            className="text-neutral-500 text-base sm:text-lg max-w-xs mx-auto leading-relaxed mb-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Sign up for field duties, submit walk-up songs, and keep your team
            running.
          </p>

          {/* Search */}
          <div
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-[11px] text-neutral-600 mb-3 uppercase tracking-[0.15em] font-medium">
              Find your team by coach&apos;s last name
            </p>
            <CoachSearch />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-white/[0.06]">
        <Link
          href="/teams/new/login"
          className="text-neutral-700 text-sm hover:text-neutral-500 transition-colors"
        >
          Site Admin
        </Link>
      </footer>
    </div>
  );
}
