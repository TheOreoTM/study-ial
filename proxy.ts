import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic check only (cookie presence). Pages still verify the session server-side.
const PROTECTED = ["/dashboard", "/practice", "/plans", "/focus", "/progress", "/settings", "/onboarding", "/admin"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (!PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return NextResponse.next();

    if (!getSessionCookie(request)) {
        const url = new URL("/sign-in", request.url);
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
