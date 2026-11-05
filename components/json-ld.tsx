import { serializeJsonLd } from "@/lib/structured-data";

/** Structured data for search engines, rendered as recommended by the Next.js JSON-LD guide. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
