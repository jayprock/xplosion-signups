"use server";

import { cookies } from "next/headers";
import { verifySiteAdminPassword } from "@/lib/data";

export async function siteAdminLoginAction(
  password: string
): Promise<{ success: boolean; error?: string }> {
  const valid = verifySiteAdminPassword(password);
  if (!valid) {
    return { success: false, error: "Incorrect password" };
  }

  const cookieStore = await cookies();
  cookieStore.set("site_admin", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "lax",
  });

  return { success: true };
}
