import { CoachSearch } from "@/components/coach-search";

export default function Home() {
  return (
    <div className="relative min-h-svh overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-black" />
      <div className="absolute top-0 right-0 w-2/3 h-1/2 bg-gradient-to-bl from-primary/8 via-transparent to-transparent" />
      <div className="absolute -top-20 -right-20 w-40 h-[140%] bg-gradient-to-b from-primary/5 via-primary/3 to-transparent rotate-12 blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          {/* Label */}
          <div
            className="mb-6 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <div className="inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-primary/70 font-semibold">
              <span className="w-8 h-px bg-primary/30" />
              Travel Baseball
              <span className="w-8 h-px bg-primary/30" />
            </div>
          </div>

          {/* Hero text */}
          <h1
            className="animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            <span className="block font-display text-[4.5rem] leading-[0.88] tracking-tight text-foreground sm:text-[5.5rem]">
              GAMEDAY
            </span>
            <span className="block font-display text-[4.5rem] leading-[0.88] tracking-tight text-primary sm:text-[5.5rem]">
              SIGNUPS
            </span>
          </h1>

          <p
            className="mt-5 text-muted-foreground text-sm leading-relaxed max-w-[260px] mx-auto animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Find your team, sign up for game day duties, and submit walk-up
            songs.
          </p>

          {/* Search */}
          <div
            className="mt-8 animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <CoachSearch />
          </div>
        </div>

        {/* Coach CTA */}
        <div
          className="absolute bottom-8 left-0 right-0 text-center animate-fade-in"
          style={{ animationDelay: "600ms" }}
        >
          <p className="text-muted-foreground/60 text-xs">
            Are you a coach?{" "}
            <span className="text-primary/70 cursor-pointer hover:text-primary hover:underline transition-colors">
              Add your team
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
