import { describe, expect, it } from "vitest";
import { search } from "./search";
import { commandDocs } from "./search-commands";

const ids = (docs: { id: string }[]) => docs.map((d) => d.id);

describe("commandDocs", () => {
    it("shows signed-out visitors only public pages and the account links", () => {
        const docs = commandDocs({ signedIn: false, isAdmin: false });
        expect(ids(docs)).toEqual(["page:subjects", "page:sign-in", "page:sign-up"]);
    });

    it("gives students the app but not admin pages or sign-in", () => {
        const got = ids(commandDocs({ signedIn: true, isAdmin: false }));
        expect(got).toContain("page:mock");
        expect(got).toContain("page:redo");
        expect(got).not.toContain("page:admin");
        expect(got).not.toContain("page:sign-in");
    });

    it("adds admin pages for admins", () => {
        expect(ids(commandDocs({ signedIn: true, isAdmin: true }))).toContain("page:admin");
    });

    it("only links inside the app", () => {
        for (const d of commandDocs({ signedIn: true, isAdmin: true })) expect(d.href.startsWith("/")).toBe(true);
    });

    it("is found by everyday words", () => {
        const docs = commandDocs({ signedIn: true, isAdmin: false });
        expect(search(docs, "mock")[0].doc.id).toBe("page:mock");
        expect(search(docs, "parent")[0].doc.id).toBe("page:share");
        expect(search(docs, "pomodoro")[0].doc.id).toBe("page:focus");
        expect(search(docs, "practise weak")[0].doc.id).toBe("page:weak");
    });
});
