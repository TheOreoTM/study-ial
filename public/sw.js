// Study-IAL service worker: a friendly offline page, nothing more.
//
// Pages are always fetched from the network (they're personal and change with every answer), and only the offline
// page and its icon are cached. When a page navigation fails because the device is offline, the offline page is
// shown instead of the browser's error. No signed-in HTML, API response or server action is ever stored.

const CACHE = "study-ial-offline-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/icon.png"];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE)
            .then((cache) => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim()),
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    if (request.mode === "navigate") {
        event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
        return;
    }

    // The offline page's own icon, when offline.
    const url = new URL(request.url);
    if (url.origin === self.location.origin && PRECACHE.includes(url.pathname)) {
        event.respondWith(fetch(request).catch(() => caches.match(url.pathname)));
    }
});
