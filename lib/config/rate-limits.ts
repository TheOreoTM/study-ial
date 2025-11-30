export const STUDENT_KEY_RATE_LIMITS: Record<string, { refillRate: number; interval: number; capacity: number }> = {
    "/api/study-plans/generate": {
        refillRate: 3,
        interval: 60,
        capacity: 5,
    },
    // Default fallback for other protected routes
    default: {
        refillRate: 10,
        interval: 60,
        capacity: 20,
    },
};
