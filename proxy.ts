import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import arcjet, { detectBot, shield, tokenBucket, ArcjetNext } from "@arcjet/next";

// Base Arcjet instance for auth routes (no rate limit, just bot/shield)
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

// Cache for route-specific Arcjet instances
const ajRouteInstances = new Map<string, ArcjetNext<any>>();

function getArcjetForRoute(path: string, limitConfig: { refillRate: number; interval: number; capacity: number }) {
    const cacheKey = `${path}-${limitConfig.refillRate}-${limitConfig.interval}-${limitConfig.capacity}`;

    if (ajRouteInstances.has(cacheKey)) {
        return ajRouteInstances.get(cacheKey)!;
    }

    const aj = arcjet({
        key: process.env.ARCJET_KEY!,
        rules: [
            shield({ mode: "LIVE" }),
            detectBot({
                mode: "LIVE",
                allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
            }),
            tokenBucket({
                mode: "LIVE",
                refillRate: limitConfig.refillRate,
                interval: limitConfig.interval,
                capacity: limitConfig.capacity,
            }),
        ],
    });

    ajRouteInstances.set(cacheKey, aj);
    return aj;
}

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const session = await auth.api.getSession({
        headers: request.headers,
    });
    const user = session?.user;

    const isPublicRoute =
        path === "/" || path.startsWith("/auth") || path.startsWith("/subjects") || path.startsWith("/api/public");

    const isStatic =
        path.startsWith("/_next") ||
        path.includes(".") || // files like .css, .js, .png
        path === "/favicon.ico";

    // if (!user && !isPublicRoute && !isStatic && !path.startsWith("/auth")) {
    //     const signInUrl = new URL("/auth/sign-in", request.url);
    //     signInUrl.searchParams.set("redirect_url", path);
    //     return NextResponse.redirect(signInUrl);
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
