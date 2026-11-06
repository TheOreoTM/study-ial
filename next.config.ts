import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Native canvas bindings and pdf.js load fonts/workers from their package folders at runtime
    serverExternalPackages: ["@napi-rs/canvas", "pdfjs-dist"],
};

export default nextConfig;
