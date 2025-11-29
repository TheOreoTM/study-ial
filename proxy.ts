import { stackServerApp } from "@/stack/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";

const ajGen = arcjet({
    key: process.env.ARCJET_KEY!,
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
        }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 5,
            interval: 60,
            capacity: 10,
        }),
    ],
});

const ajAuth = arcjet({
    key: process.env.ARCJET_KEY!,
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
        }),
    ],
});

export async function proxy(request: NextRequest) {
    const user = await stackServerApp.getUser();
    const path = request.nextUrl.pathname;

    if (path.startsWith("/api/study-plans/generate")) {
        const decision = await ajGen.protect(request, { requested: 1 });
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return NextResponse.json({ error: "Too Many Requests", reason: decision.reason }, { status: 429 });
            } else {
                return NextResponse.json({ error: "Forbidden", reason: decision.reason }, { status: 403 });
            }
        }
    } else if (path.startsWith("/sign-in") || path.startsWith("/sign-up") || path.startsWith("/handler")) {
        const decision = await ajAuth.protect(request);
        if (decision.isDenied()) {
            return NextResponse.json({ error: "Forbidden", reason: decision.reason }, { status: 403 });
        }
    }

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
