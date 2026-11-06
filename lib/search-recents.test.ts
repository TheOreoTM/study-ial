import { describe, expect, it } from "vitest";
import { addRecent, MAX_RECENTS, parseRecents, type RecentPick } from "./search-recents";

const pick = (href: string): RecentPick => ({ href, name: href, context: "", kind: "topic" });

describe("addRecent", () => {
    it("puts the newest first and drops duplicates", () => {
        expect(addRecent([pick("/a"), pick("/b")], pick("/b")).map((r) => r.href)).toEqual(["/b", "/a"]);
    });
    it("keeps at most the limit", () => {
        let list: RecentPick[] = [];
        for (let i = 0; i < 9; i++) list = addRecent(list, pick(`/${i}`));
        expect(list).toHaveLength(MAX_RECENTS);
        expect(list[0].href).toBe("/8");
    });
});

describe("parseRecents", () => {
    it("reads what addRecent stored", () => {
        expect(parseRecents(JSON.stringify([pick("/a")]))).toEqual([pick("/a")]);
    });
    it("ignores junk and links that leave the site", () => {
        expect(parseRecents(null)).toEqual([]);
        expect(parseRecents("not json")).toEqual([]);
        expect(parseRecents(JSON.stringify({ href: "/a" }))).toEqual([]);
        expect(
            parseRecents(JSON.stringify([pick("https://evil.example"), pick("//evil.example"), pick("/ok"), { href: 1 }])),
        ).toEqual([pick("/ok")]);
    });
});
