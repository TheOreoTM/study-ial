import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: site.name,
        short_name: site.name,
        description: site.description,
        start_url: "/dashboard",
        display: "standalone",
        background_color: "#fbfaf7",
        theme_color: "#0f766e",
        icons: [{ src: "/icon.png", sizes: "1024x1024", type: "image/png" }],
    };
}
