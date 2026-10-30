/**
 * Returns `next` only if it is a same-origin relative path; otherwise `fallback`.
 * Parses with a dummy origin so tricks like "/\evil.com", "//evil.com" or "/%09/evil.com" can't escape.
 */
export function safeRedirect(next: unknown, fallback = "/dashboard") {
    if (typeof next !== "string" || !next.startsWith("/") || /[\\\u0000-\u001f]/.test(next)) return fallback;
    try {
        const base = "http://local.invalid";
        const url = new URL(next, base);
        if (url.origin !== base) return fallback;
        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return fallback;
    }
}
