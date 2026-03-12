import { notFound } from "next/navigation";
import { getTeamBySlug } from "@/lib/data";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage({
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
          <h1 className="font-heading text-4xl tracking-tight leading-none">
            {team.name.toUpperCase()}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Admin Login</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <LoginForm teamSlug={teamSlug} />
      </main>
    </div>
  );
}
