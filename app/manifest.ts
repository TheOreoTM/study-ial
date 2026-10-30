import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: site.name,
        short_name: site.name,
        description: site.description,
        start_url: "/dashboard",
        display: "standalone",
        background_color: "#fffaf4",
        theme_color: "#ff7a3d",
        icons: [{ src: "/icon.png", sizes: "1024x1024", type: "image/png" }],
    };
}
