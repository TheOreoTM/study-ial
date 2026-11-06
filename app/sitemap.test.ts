import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/queries/curriculum", () => ({
    getCurriculumPaths: async () => [
        { slug: "mathematics", units: [{ code: "WMA11", topics: [{ slug: "algebra" }] }] },
    ],
}));

const { default: sitemap } = await import("./sitemap");
const { default: robots } = await import("./robots");

describe("sitemap and robots keep Pearson material out of search", () => {
    it("lists no paper pages, files or API routes", async () => {
        const urls = (await sitemap()).map((e) => new URL(e.url).pathname);
        expect(urls.length).toBeGreaterThan(0);
        for (const u of urls) {
            expect(u).not.toMatch(/^\/(papers|past-papers|api)(\/|$)/);
            expect(u).not.toMatch(/\.pdf$/i);
        }
    });

    it("disallows the private paper workspace and the API", () => {
        const rules = robots().rules;
        const disallow = (Array.isArray(rules) ? rules[0] : rules).disallow;
        expect(disallow).toEqual(expect.arrayContaining(["/papers", "/api/"]));
    });
});
