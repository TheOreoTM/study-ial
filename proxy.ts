import { stackServerApp } from "@/stack/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const user = await stackServerApp.getUser();
    const path = request.nextUrl.pathname;

    // Define public routes
    const isPublicRoute =
        path === "/" || path.startsWith("/handler") || path.startsWith("/subjects") || path.startsWith("/api/public"); // Assuming some public APIs

    // Check if it's a static asset or Next.js internal
    const isStatic =
        path.startsWith("/_next") ||
        path.includes(".") || // files like .css, .js, .png
        path === "/favicon.ico";

    if (!user && !isPublicRoute && !isStatic) {
        const signInUrl = new URL("/handler/sign-in", request.url);
        signInUrl.searchParams.set("redirect_url", path);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
