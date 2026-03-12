import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(
    /^\/t\/([^/]+)\/admin(?:\/|$)/
  );
  if (!match) return NextResponse.next();

  const teamSlug = match[1];

  // Allow access to the login page
  if (request.nextUrl.pathname === `/t/${teamSlug}/admin/login`) {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const cookie = request.cookies.get(`admin_${teamSlug}`);
  if (!cookie) {
    return NextResponse.redirect(
      new URL(`/t/${teamSlug}/admin/login`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/t/:teamSlug/admin/:path*",
};
