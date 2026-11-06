import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Native canvas bindings and pdf.js load fonts/workers from their package folders at runtime
    serverExternalPackages: ["@napi-rs/canvas", "pdfjs-dist"],

    async headers() {
        return [
            {
                // The offline service worker (public/sw.js): always revalidated so fixes reach students straight away,
                // and locked to same-origin scripts, as the Next.js PWA guide recommends.
                source: "/sw.js",
                headers: [
                    { key: "Content-Type", value: "application/javascript; charset=utf-8" },
                    { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
                    { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
                ],
            },
        ];
    },
};

export default nextConfig;
