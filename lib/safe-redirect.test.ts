import { describe, expect, it } from "vitest";
import { safeRedirect } from "./safe-redirect";

describe("safeRedirect", () => {
    it("keeps same-origin paths", () => {
        expect(safeRedirect("/plans/abc?x=1#t")).toBe("/plans/abc?x=1#t");
    });
    it.each(["//evil.com", "/\\evil.com", "/\\/evil.com", "https://evil.com", "/\tevil", "evil.com", "", null, ["/a"]])(
        "rejects %j",
        (next) => {
            expect(safeRedirect(next)).toBe("/dashboard");
        },
    );
});
