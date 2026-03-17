"use server";

import { revalidatePath } from "next/cache";
import {
  claimSignupSlot,
  updateSignupEntry,
  deleteSignupEntry,
} from "@/lib/data";
import type { SignupEntry } from "@/lib/types";

export async function signupAction(
  teamSlug: string,
  listId: string,
  slotIndex: number,
  values: Record<string, string>
): Promise<{ entry?: SignupEntry; error?: string }> {
  const result = await claimSignupSlot(listId, slotIndex, values);
  if (result.entry) {
    revalidatePath(`/${teamSlug}`);
  }
  return result;
}

export async function updateEntryAction(
  teamSlug: string,
  listId: string,
  entryId: string,
  values: Record<string, string>
): Promise<SignupEntry> {
  const entry = await updateSignupEntry(listId, entryId, values);
  revalidatePath(`/${teamSlug}`);
  return entry;
}

export async function removeEntryAction(
  teamSlug: string,
  listId: string,
  entryId: string
): Promise<void> {
  await deleteSignupEntry(listId, entryId);
  revalidatePath(`/${teamSlug}`);
}
