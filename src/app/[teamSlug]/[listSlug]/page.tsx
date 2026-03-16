import { notFound } from "next/navigation";
import { getTeamBySlug, getSignupListBySlug } from "@/lib/data";
import { SignupListClient } from "./signup-list-client";

export default async function SignupListPage({
  params,
}: {
  params: Promise<{ teamSlug: string; listSlug: string }>;
}) {
  const { teamSlug, listSlug } = await params;
  const team = await getTeamBySlug(teamSlug);
  if (!team) notFound();

  const list = await getSignupListBySlug(team.id, listSlug);
  if (!list) notFound();

  return <SignupListClient team={team} list={list} />;
}
