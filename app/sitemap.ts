import type { MetadataRoute } from "next";
import { getCurriculumPaths } from "@/lib/queries/curriculum";
import { site } from "@/lib/site";

// Regenerate hourly as the curriculum grows.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const url = (path: string) => new URL(path, site.url).toString();
    const entries: MetadataRoute.Sitemap = [
        { url: url("/"), changeFrequency: "weekly", priority: 1 },
        { url: url("/subjects"), changeFrequency: "weekly", priority: 0.9 },
    ];

    let subjects: Awaited<ReturnType<typeof getCurriculumPaths>> = [];
    try {
        subjects = await getCurriculumPaths();
    } catch (err) {
        // Don't fail a build/deploy because the database is briefly unreachable.
        console.error("sitemap: couldn't load curriculum", err);
    }

    for (const s of subjects) {
        entries.push({ url: url(`/subjects/${s.slug}`), changeFrequency: "weekly", priority: 0.8 });
        for (const u of s.units) {
            if (u.topics.length === 0) continue;
            const unitPath = `/subjects/${s.slug}/${u.code.toLowerCase()}`;
            entries.push({ url: url(unitPath), changeFrequency: "weekly", priority: 0.7 });
            for (const t of u.topics) {
                entries.push({ url: url(`${unitPath}/${t.slug}`), changeFrequency: "weekly", priority: 0.6 });
            }
        }
    }
    return entries;
}
