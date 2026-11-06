import { getSearchDocs } from "@/lib/queries/curriculum";

// The public curriculum search index (~25 KB gzipped). The browser fetches it once and searches locally on every
// keystroke, so it's cached hard: 5 minutes in the browser, an hour on the CDN, and served stale for a day while it
// refreshes. Nothing personal goes in here (see /api/search/personal).
export async function GET() {
    const docs = await getSearchDocs();
    return Response.json(
        { docs },
        { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } },
    );
}
