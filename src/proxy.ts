import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("adhikaar_session")?.value;

  // If already authenticated and visiting sign-in or sign-up, redirect to /app
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    if (session) {
      return NextResponse.redirect(new URL("/app", request.url));
    }
    return NextResponse.next();
  }

  // Legacy or alias route: /dashboard -> /app
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", "/app");
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Protected routes: /app and subroutes
  if (pathname.startsWith("/app")) {
    if (!session) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/dashboard/:path*", "/sign-in", "/sign-up"],
};
