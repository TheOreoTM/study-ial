import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://study.oreotm.xyz";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/admin/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
