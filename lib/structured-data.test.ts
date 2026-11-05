import { describe, expect, it } from "vitest";
import { breadcrumbList, course, serializeJsonLd } from "./structured-data";

const base = "https://study-ial.example";

describe("breadcrumbList", () => {
    it("numbers crumbs from 1 with absolute URLs", () => {
        const b = breadcrumbList(base, [
            { name: "Subjects", path: "/subjects" },
            { name: "Physics", path: "/subjects/physics" },
        ]) as { itemListElement: { position: number; item: string; name: string }[] };
        expect(b.itemListElement).toEqual([
            { "@type": "ListItem", position: 1, name: "Subjects", item: `${base}/subjects` },
            { "@type": "ListItem", position: 2, name: "Physics", item: `${base}/subjects/physics` },
        ]);
    });
});

describe("course", () => {
    const c = { name: "WPH11", description: "d", path: "/subjects/physics/wph11", code: "WPH11", siteName: "Study-IAL" };
    it("claims the IAL credential only for Pearson subjects", () => {
        expect(course(base, { ...c, local: false })).toHaveProperty("educationalCredentialAwarded");
        expect(course(base, { ...c, local: true })).not.toHaveProperty("educationalCredentialAwarded");
    });
    it("is free and lists parts when given", () => {
        const out = course(base, { ...c, local: false, parts: [{ name: "Motion", path: "/m" }] });
        expect(out.isAccessibleForFree).toBe(true);
        expect(out.hasPart).toEqual([{ "@type": "Course", name: "Motion", url: `${base}/m` }]);
    });
});

describe("serializeJsonLd", () => {
    it("escapes < so content can't end the script tag", () => {
        const s = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
        expect(s).not.toContain("<");
        expect(JSON.parse(s).name).toBe("</script><script>alert(1)</script>");
    });
});
