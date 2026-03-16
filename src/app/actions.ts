"use server";

import { searchTeamsByCoach } from "@/lib/data";
import type { Team } from "@/lib/types";

export async function searchTeamsAction(
  lastName: string
): Promise<Team[]> {
  return searchTeamsByCoach(lastName);
}
