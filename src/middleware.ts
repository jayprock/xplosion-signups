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

  // --- /[teamSlug]/admin/*: requires team or site admin cookie ---
  const match = pathname.match(/^\/([^/]+)\/admin/);
  if (!match) return NextResponse.next();

  const teamSlug = match[1];

  // Skip paths that belong to other top-level routes
  if (teamSlug === "teams") return NextResponse.next();

  // Don't block the login page itself
  if (pathname === `/${teamSlug}/admin/login`) {
    return NextResponse.next();
  }

  // Site admin cookie grants access to all teams
  const siteAdmin = request.cookies.get("site_admin");
  if (siteAdmin?.value) return NextResponse.next();

  // Team-specific admin cookie
  const teamCookie = request.cookies.get(`admin_${teamSlug}`);
  if (teamCookie?.value) return NextResponse.next();

  return NextResponse.redirect(
    new URL(`/${teamSlug}/admin/login`, request.url)
  );
}

export const config = {
  matcher: ["/:teamSlug/admin/:path*", "/teams/new"],
};
