"use server";

import { revalidatePath } from "next/cache";
import { createTeam, generateTeamSlug } from "@/lib/data";

export async function createTeamAction(data: {
  name: string;
  coachLastName: string;
  seasonYear: number;
  adminPassword: string;
}): Promise<{ teamSlug: string }> {
  const slug = generateTeamSlug(data.name);

  const team = createTeam({
    ...data,
    slug,
  });

  revalidatePath("/");
  return { teamSlug: team.slug };
}
