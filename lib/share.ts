// Read-only progress links for parents and teachers. Token helpers (unit-tested).
//
// A link is a capability: whoever holds it can see the student's progress summary, nothing else. Only a SHA-256
// hash of the token is stored, so a database leak doesn't hand out working links; the student sees the full link
// once, when it's created, and can replace or turn it off at any time.

import { createHash, randomBytes } from "node:crypto";

/** 32 random bytes as base64url: 43 characters. */
export function newShareToken() {
    return randomBytes(32).toString("base64url");
}

export function hashShareToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
}

/** Cheap shape check before touching the database. */
export function isShareTokenShaped(token: string) {
    return /^[A-Za-z0-9_-]{43}$/.test(token);
}

export function sharePath(token: string) {
    return `/share/${token}`;
}

/** First name only: the person holding the link doesn't need the student's full name. */
export function shareDisplayName(name: string) {
    const first = name.trim().split(/\s+/)[0];
    return first || "This student";
}
