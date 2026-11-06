import { describe, expect, it } from "vitest";
import {
    groupHits,
    highlight,
    normalize,
    plainSnippet,
    prepareDocs,
    scoreDoc,
    search,
    searchPrepared,
    tokenize,
    type SearchDoc,
} from "./search";

const docs: SearchDoc[] = [
    {
        kind: "subject",
        id: "s",
        href: "/subjects/physics",
        name: "Physics",
        code: "YPH11",
        context: "Subject",
        summary: "Mechanics, waves, electricity",
    },
    {
        kind: "unit",
        id: "u",
        href: "/subjects/physics/wph11",
        name: "Mechanics and Materials",
        code: "WPH11",
        context: "Physics",
    },
    {
        kind: "topic",
        id: "t1",
        href: "/subjects/physics/wph11/motion",
        name: "Motion and kinematics",
        code: "1.1",
        context: "Physics · WPH11",
        summary: "Uniformly accelerated motion and projectile motion.",
        specPoints: ["Be able to use the equations for uniformly accelerated motion", "Understand projectile motion"],
    },
    {
        kind: "topic",
        id: "t2",
        href: "/subjects/physics/wph11/momentum",
        name: "Momentum",
        code: "1.3",
        context: "Physics · WPH11",
        specPoints: ["Be able to use the principle of conservation of linear momentum"],
    },
    {
        kind: "topic",
        id: "t3",
        href: "/subjects/physics/wph12/waves",
        name: "Progressive waves",
        code: "2.1",
        context: "Physics · WPH12",
        specPoints: ["Be able to use the wave equation $v = f\\lambda$"],
    },
];

describe("normalize/tokenize", () => {
    it("lower-cases and strips markup", () => {
        expect(normalize("**Newton's** $F = ma$")).toBe("newton's f = ma");
        expect(normalize("Wave–particle")).toBe("wave particle");
    });
    it("keeps codes whole and drops duplicates", () => {
        expect(tokenize("WPH11 1.2 wph11")).toEqual(["wph11", "1.2"]);
        expect(tokenize("  momentum? ")).toEqual(["momentum"]);
    });
    it("caps the number of words", () => {
        expect(tokenize("a b c d e f g h i j")).toHaveLength(8);
    });
});

describe("search", () => {
    it("finds a topic by name", () => {
        expect(search(docs, "momentum")[0].doc.id).toBe("t2");
    });

    it("finds a unit by its code before its topics", () => {
        expect(search(docs, "wph11")[0].doc.id).toBe("u");
    });

    it("needs every word to match", () => {
        expect(search(docs, "momentum waves")).toEqual([]);
    });

    it("matches word starts, not the middle of words", () => {
        expect(search(docs, "mentum")).toEqual([]);
        expect(search(docs, "proj").map((h) => h.doc.id)).toEqual(["t1"]);
    });

    it("reaches into spec points and reports the point", () => {
        const [hit] = search(docs, "conservation");
        expect(hit.doc.id).toBe("t2");
        expect(hit.point).toEqual({ index: 0, text: docs[3].specPoints![0] });
    });

    it("doesn't report a spec point when the name matched", () => {
        expect(search(docs, "momentum")[0].point).toBeNull();
    });

    it("ranks an exact name above a passing mention", () => {
        const hits = search(docs, "motion");
        expect(hits[0].doc.id).toBe("t1");
    });

    it("is empty for an empty query", () => {
        expect(search(docs, "   ")).toEqual([]);
        expect(scoreDoc(docs[0], [])).toBeNull();
    });

    it("respects the limit", () => {
        expect(search(docs, "physics", 2)).toHaveLength(2);
    });
});

describe("highlight", () => {
    it("marks word-start matches, case-insensitively", () => {
        expect(highlight("Motion and kinematics", ["mot", "kin"])).toEqual([
            { text: "Mot", match: true },
            { text: "ion and ", match: false },
            { text: "kin", match: true },
            { text: "ematics", match: false },
        ]);
    });
    it("leaves mid-word text alone", () => {
        expect(highlight("Momentum", ["ent"])).toEqual([{ text: "Momentum", match: false }]);
    });
    it("handles empty text", () => {
        expect(highlight("", ["a"])).toEqual([]);
    });
});

describe("plainSnippet", () => {
    it("unwraps LaTeX and trims long text", () => {
        expect(plainSnippet("Use $v = f\\lambda$ here")).toBe("Use v = fλ here");
        expect(plainSnippet("$\\Delta E = mc^2$")).toBe("Δ E = mc^2");
        expect(plainSnippet("length $0.80\\,\\text{m}$ at $120\\,\\text{Hz}$")).toBe("length 0.80 m at 120 Hz");
        expect(plainSnippet("x".repeat(300), 20)).toHaveLength(20);
    });
});

describe("prepared search", () => {
    it("gives the same results as searching raw docs", () => {
        const prepared = prepareDocs(docs);
        for (const q of ["momentum", "wph11", "proj", "conservation", "physics"]) {
            expect(searchPrepared(prepared, q)).toEqual(search(docs, q));
        }
    });

    it("finds documents by their keywords", () => {
        const page: SearchDoc = {
            kind: "page",
            id: "share",
            href: "/settings#share",
            name: "Share your progress",
            code: "",
            context: "Settings",
            keywords: ["parent", "teacher", "link"],
        };
        const [hit] = search([...docs, page], "parent");
        expect(hit.doc.id).toBe("share");
    });

    it("never matches an empty code to a token", () => {
        const page: SearchDoc = { kind: "page", id: "p", href: "/", name: "Mock papers", code: "", context: "" };
        expect(search([page], "")).toEqual([]);
        expect(search([page], "mock")[0].doc.id).toBe("p");
    });
});

describe("groupHits", () => {
    const hit = (kind: SearchDoc["kind"], id: string, score: number) => ({
        doc: { kind, id, href: "/", name: id, code: "", context: "" },
        score,
        point: null,
    });

    it("orders groups by their best hit and caps each kind", () => {
        const groups = groupHits(
            [hit("page", "p1", 120), hit("topic", "t1", 100), hit("topic", "t2", 90), hit("topic", "t3", 80), hit("unit", "u1", 50)],
            { topic: 2 },
        );
        expect(groups.map((g) => g.kind)).toEqual(["page", "topic", "unit"]);
        expect(groups[1].hits.map((h) => h.doc.id)).toEqual(["t1", "t2"]);
    });

    it("is empty without hits", () => {
        expect(groupHits([])).toEqual([]);
    });
});
