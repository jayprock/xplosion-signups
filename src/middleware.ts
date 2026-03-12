import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Extract team slug from /t/[teamSlug]/admin/...
  const match = pathname.match(/^\/t\/([^/]+)\/admin/);
  if (!match) return NextResponse.next();

  const teamSlug = match[1];

  // Don't block the login page itself
  if (pathname === `/t/${teamSlug}/admin/login`) {
    return NextResponse.next();
  }

  // Check for admin cookie
  const cookie = request.cookies.get(`admin_${teamSlug}`);

  if (!cookie?.value) {
    return NextResponse.redirect(
      new URL(`/t/${teamSlug}/admin/login`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/t/:teamSlug/admin/:path*"],
};
