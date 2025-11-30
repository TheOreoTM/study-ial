import { prisma } from "@/lib/prisma";
import { STUDENT_KEY_RATE_LIMITS } from "@/lib/config/rate-limits";

export function extractApiKey(request: Request): string | null {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }

    const apiKeyHeader = request.headers.get("X-API-Key");
    if (apiKeyHeader) {
        return apiKeyHeader;
    }

    return null;
}

export async function validateStudentApiKey(key: string) {
    if (!key.startsWith("sk_student_")) {
        return null;
    }

    const apiKey = await prisma.apiKey.findUnique({
        where: {
            key: key,
        },
        include: {
            user: true,
        },
    });

    if (!apiKey) {
        return null;
    }

    if (apiKey.revokedAt) {
        return null;
    }

    return apiKey;
}

export function getStudentKeyRateLimit(path: string) {
    // Check for exact match
    if (STUDENT_KEY_RATE_LIMITS[path]) {
        return STUDENT_KEY_RATE_LIMITS[path];
    }

    // Check for prefix match (longest match wins)
    const sortedKeys = Object.keys(STUDENT_KEY_RATE_LIMITS)
        .filter((k) => k !== "default")
        .sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
        if (path.startsWith(key)) {
            return STUDENT_KEY_RATE_LIMITS[key];
        }
    }

    return STUDENT_KEY_RATE_LIMITS["default"];
}
