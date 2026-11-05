// schema.org JSON-LD for the public curriculum pages. Pure builders (unit-tested); pages render them with <JsonLd>.

export type Crumb = { name: string; path: string };

type Json = Record<string, unknown>;

const abs = (base: string, path: string) => new URL(path, base).toString();

/** BreadcrumbList for a page's breadcrumb trail (the last crumb is the page itself). */
export function breadcrumbList(base: string, crumbs: Crumb[]): Json {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: abs(base, c.path),
        })),
    };
}

/**
 * A free Course for a subject or unit. `code` is the Pearson qualification or paper code; local subjects (Islam)
 * aren't Pearson's, so they don't claim it as the provider.
 */
export function course(
    base: string,
    c: { name: string; description: string; path: string; code: string; local: boolean; siteName: string; parts?: Crumb[] },
): Json {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: c.name,
        description: c.description,
        url: abs(base, c.path),
        courseCode: c.code,
        inLanguage: "en",
        isAccessibleForFree: true,
        provider: { "@type": "Organization", name: c.siteName, url: abs(base, "/") },
        ...(c.local
            ? {}
            : {
                  educationalCredentialAwarded: "Pearson Edexcel International Advanced Level",
              }),
        ...(c.parts?.length
            ? { hasPart: c.parts.map((p) => ({ "@type": "Course", name: p.name, url: abs(base, p.path) })) }
            : {}),
        offers: { "@type": "Offer", category: "Free", price: 0, priceCurrency: "USD" },
    };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so content can't close the tag. */
export function serializeJsonLd(data: Json | Json[]) {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}
