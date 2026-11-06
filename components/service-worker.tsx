"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js, which only shows a friendly offline page when a page can't load (see public/sw.js). Production
 * only: in development it would get in the way of hot reloading.
 */
export function ServiceWorker() {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
        navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
    }, []);
    return null;
}
