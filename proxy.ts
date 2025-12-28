import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import arcjet, { detectBot, shield, tokenBucket, ArcjetNext } from "@arcjet/next";
import { extractApiKey, validateStudentApiKey, getStudentKeyRateLimit } from "@/lib/api-key/validate";

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

    // 1. Handle AI Generation Routes (Protected by API Key)
    if (path.startsWith("/api/study-plans/generate")) {
        const apiKey = extractApiKey(request);

        if (!apiKey) {
            return NextResponse.json({ error: "Unauthorized: Missing API Key" }, { status: 401 });
        }

        // Check if it's a student key
        if (apiKey.startsWith("sk_student_")) {
            const validKey = await validateStudentApiKey(apiKey);

            if (!validKey) {
                return NextResponse.json({ error: "Unauthorized: Invalid or revoked API Key" }, { status: 401 });
            }

            // Get rate limit config for this route
            const limitConfig = getStudentKeyRateLimit(path);
            const aj = getArcjetForRoute(path, limitConfig);

            // Apply protection (deduct 1 token)
            const decision = await aj.protect(request, { requested: 1 });

            if (decision.isDenied()) {
                if (decision.reason.isRateLimit()) {
                    return NextResponse.json({ error: "Too Many Requests", reason: decision.reason }, { status: 429 });
                } else {
                    return NextResponse.json({ error: "Forbidden", reason: decision.reason }, { status: 403 });
                }
            }
        } else {
            // Handle other key types if necessary, or reject
            return NextResponse.json({ error: "Unauthorized: Invalid API Key type" }, { status: 401 });
        }
    }
    // 2. Handle Auth Routes
    else if (path.startsWith("/auth")) {
        const decision = await ajAuth.protect(request);
        if (decision.isDenied()) {
            return NextResponse.json({ error: "Forbidden", reason: decision.reason }, { status: 403 });
        }
    }

    // 3. Standard Auth Check for other routes (Better Auth)
    const session = await auth.api.getSession({
        headers: request.headers,
    });
    const user = session?.user;

    // Define public routes
    const isPublicRoute =
        path === "/" || path.startsWith("/auth") || path.startsWith("/subjects") || path.startsWith("/api/public");

    // Check if it's a static asset or Next.js internal
    const isStatic =
        path.startsWith("/_next") ||
        path.includes(".") || // files like .css, .js, .png
        path === "/favicon.ico";

    if (!user && !isPublicRoute && !isStatic) {
        const signInUrl = new URL("/auth/sign-in", request.url);
        signInUrl.searchParams.set("redirect_url", path);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
