"use server";

import { revalidatePath } from "next/cache";
import { createTeam, generateTeamSlug, addPlayer } from "@/lib/data";

export async function createTeamAction(data: {
  name: string;
  coachLastName: string;
  seasonYear: number;
  adminPassword: string;
  playerNames?: string[];
}): Promise<{ teamSlug: string }> {
  const slug = await generateTeamSlug(data.coachLastName);

  const { playerNames, ...teamData } = data;
  const team = await createTeam({
    ...teamData,
    slug,
  });

  if (playerNames && playerNames.length > 0) {
    await Promise.all(playerNames.map((name) => addPlayer(team.id, name)));
  }

  revalidatePath("/");
  return { teamSlug: team.slug };
}
