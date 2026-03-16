"use server";

import { revalidatePath } from "next/cache";
import { createTeam, generateTeamSlug } from "@/lib/data";

export async function createTeamAction(data: {
  name: string;
  coachLastName: string;
  seasonYear: number;
  adminPassword: string;
}): Promise<{ teamSlug: string }> {
  const slug = await generateTeamSlug(data.name);

  const team = await createTeam({
    ...data,
    slug,
  });

  revalidatePath("/");
  return { teamSlug: team.slug };
}
