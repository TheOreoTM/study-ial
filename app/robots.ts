import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: ["/", "/subjects"],
            disallow: [
                "/api/",
                "/dashboard",
                "/practice",
                "/progress",
                "/plans",
                "/focus",
                "/settings",
                "/admin",
                "/onboarding",
            ],
        },
        sitemap: new URL("/sitemap.xml", site.url).toString(),
    };
}
