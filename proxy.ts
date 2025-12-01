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
    else if (path.startsWith("/sign-in") || path.startsWith("/sign-up") || path.startsWith("/api/auth")) {
        const decision = await ajAuth.protect(request);
        if (decision.isDenied()) {
            return NextResponse.json({ error: "Forbidden", reason: decision.reason }, { status: 403 });
        }
    }

    // 3. Standard Auth Check for other routes (Better Auth)
    // Note: Middleware in Next.js with Better Auth is usually handled via auth.api.getSession
    // But since we are in a proxy function (likely called from middleware or similar), we can check session.
    // However, better-auth session check in middleware requires a bit more setup or using the client token.
    // For now, we will rely on client-side protection and server-side checks in server actions/API routes.
    // Or we can use the `auth.api.getSession` if this is running in a context where headers are available.

    // Define public routes
    const isPublicRoute =
        path === "/" ||
        path.startsWith("/sign-in") ||
        path.startsWith("/sign-up") ||
        path.startsWith("/api/auth") ||
        path.startsWith("/subjects") ||
        path.startsWith("/api/public");

    // Check if it's a static asset or Next.js internal
    const isStatic =
        path.startsWith("/_next") ||
        path.includes(".") || // files like .css, .js, .png
        path === "/favicon.ico";

    // If we want to enforce auth in middleware, we would need to fetch session here.
    // For simplicity in this migration step, we'll allow the request to proceed
    // and let the page/API level checks handle auth, or implement a proper middleware check later.
    // If this `proxy` function IS the middleware, we should implement session check.

    // Assuming this is used in middleware.ts
    if (!isPublicRoute && !isStatic) {
        const { data: session } = await import("@/lib/auth-client").then((m) =>
            m.authClient.getSession({
                fetchOptions: {
                    headers: {
                        cookie: request.headers.get("cookie") || "",
                    },
                },
            })
        );

        if (!session) {
            const signInUrl = new URL("/sign-in", request.url);
            // signInUrl.searchParams.set("callbackUrl", path); // Better Auth uses callbackUrl usually
            return NextResponse.redirect(signInUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
