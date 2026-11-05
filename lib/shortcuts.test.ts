import { describe, expect, it } from "vitest";
import { enterChecks, ignoreKey, optionIndexForKey } from "./shortcuts";

const plain = { metaKey: false, ctrlKey: false, altKey: false };

describe("optionIndexForKey", () => {
    it("maps letters and digits to options", () => {
        expect(optionIndexForKey("a", 4)).toBe(0);
        expect(optionIndexForKey("D", 4)).toBe(3);
        expect(optionIndexForKey("1", 4)).toBe(0);
        expect(optionIndexForKey("4", 4)).toBe(3);
    });
    it("ignores keys past the last option and other keys", () => {
        expect(optionIndexForKey("e", 4)).toBeNull();
        expect(optionIndexForKey("5", 4)).toBeNull();
        expect(optionIndexForKey("0", 4)).toBeNull();
        expect(optionIndexForKey("Enter", 4)).toBeNull();
        expect(optionIndexForKey("?", 4)).toBeNull();
    });
});

describe("ignoreKey", () => {
    it("leaves typing alone", () => {
        expect(ignoreKey(plain, { tagName: "TEXTAREA" })).toBe(true);
        expect(ignoreKey(plain, { tagName: "INPUT", type: "text" })).toBe(true);
        expect(ignoreKey(plain, { tagName: "DIV", isContentEditable: true })).toBe(true);
    });
    it("leaves shortcuts with modifiers alone", () => {
        expect(ignoreKey({ ...plain, ctrlKey: true }, null)).toBe(true);
        expect(ignoreKey({ ...plain, metaKey: true }, { tagName: "BODY" })).toBe(true);
    });
    it("handles keys on the page, radios and buttons", () => {
        expect(ignoreKey(plain, { tagName: "BODY" })).toBe(false);
        expect(ignoreKey(plain, { tagName: "INPUT", type: "radio" })).toBe(false);
        expect(ignoreKey(plain, { tagName: "BUTTON" })).toBe(false);
        expect(ignoreKey(plain, null)).toBe(false);
    });
});

describe("enterChecks", () => {
    it("lets buttons and links handle Enter themselves", () => {
        expect(enterChecks({ tagName: "BUTTON" })).toBe(false);
        expect(enterChecks({ tagName: "A" })).toBe(false);
        expect(enterChecks({ tagName: "BODY" })).toBe(true);
        expect(enterChecks(null)).toBe(true);
        expect(enterChecks({ tagName: "BUTTON", role: "radio" })).toBe(true);
    });
});
