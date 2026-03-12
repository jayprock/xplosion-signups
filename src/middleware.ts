import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match /t/[teamSlug]/admin routes (but not /admin/login)
  const adminMatch = pathname.match(/^\/t\/([^/]+)\/admin(\/.*)?$/);
  if (!adminMatch) return NextResponse.next();

  const teamSlug = adminMatch[1];
  const subPath = adminMatch[2] || "";

  // Allow the login page through
  if (subPath === "/login") return NextResponse.next();

  // Check for admin session cookie
  const cookieName = `admin_session_${teamSlug}`;
  const session = request.cookies.get(cookieName);

  if (!session || session.value !== "authenticated") {
    const loginUrl = new URL(`/t/${teamSlug}/admin/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/t/:teamSlug/admin/:path*",
};
