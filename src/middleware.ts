import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // --- /teams/new: requires site_admin cookie ---
  if (pathname === "/teams/new") {
    const siteAdmin = request.cookies.get("site_admin");
    if (!siteAdmin?.value) {
      return NextResponse.redirect(
        new URL("/teams/new/login", request.url)
      );
    }
    return NextResponse.next();
  }

  // --- /t/[teamSlug]/admin/*: requires team or site admin cookie ---
  const match = pathname.match(/^\/t\/([^/]+)\/admin/);
  if (!match) return NextResponse.next();

  const teamSlug = match[1];

  // Don't block the login page itself
  if (pathname === `/t/${teamSlug}/admin/login`) {
    return NextResponse.next();
  }

  // Site admin cookie grants access to all teams
  const siteAdmin = request.cookies.get("site_admin");
  if (siteAdmin?.value) return NextResponse.next();

  // Team-specific admin cookie
  const teamCookie = request.cookies.get(`admin_${teamSlug}`);
  if (teamCookie?.value) return NextResponse.next();

  return NextResponse.redirect(
    new URL(`/t/${teamSlug}/admin/login`, request.url)
  );
}

export const config = {
  matcher: ["/t/:teamSlug/admin/:path*", "/teams/new"],
};
