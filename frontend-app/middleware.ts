import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = new Set(["/", "/login", "/signup"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.has(pathname)) return NextResponse.next();

  const hasSession =
    request.cookies.has("token") || request.cookies.has("connect.sid");

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/feed",
    "/profile",
    "/connections",
    "/requests",
    "/premium",
    "/chat",
    "/chat/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
