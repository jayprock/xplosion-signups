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
    <div className="min-h-dvh bg-neutral-950 flex flex-col">
      <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl tracking-tight text-white leading-none">
              {team.name.toUpperCase()}
            </h1>
            <p className="text-neutral-500 text-sm mt-2">Admin Login</p>
          </div>
          <LoginForm teamSlug={teamSlug} />
        </div>
      </div>
    </div>
  );
}
