import Link from "next/link";
import { notFound } from "next/navigation";
import { getTeamBySlug } from "@/lib/data";
import { SettingsForm } from "./settings-form";
import { ArrowLeft } from "lucide-react";

export default async function TeamSettingsPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);
  if (!team) notFound();

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-5">
          <Link
            href={`/t/${teamSlug}/admin`}
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm mb-3"
          >
            <ArrowLeft className="size-3.5" />
            Dashboard
          </Link>
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            TEAM SETTINGS
          </h1>
          <p className="text-neutral-500 text-sm mt-1">{team.name}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <SettingsForm teamSlug={teamSlug} team={team} />
      </main>
    </div>
  );
}
