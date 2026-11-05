// Practice keyboard shortcuts. Pure key mapping (unit-tested); the question view wires it up.

/** A–D (or 1–4, and on to the option count) pick an option: returns its index, or null for any other key. */
export function optionIndexForKey(key: string, count: number): number | null {
    if (key.length !== 1) return null;
    const k = key.toLowerCase();
    let i = -1;
    if (k >= "a" && k <= "z") i = k.charCodeAt(0) - 97;
    else if (k >= "1" && k <= "9") i = k.charCodeAt(0) - 49;
    return i >= 0 && i < count ? i : null;
}

type KeyLike = { metaKey: boolean; ctrlKey: boolean; altKey: boolean };
type TargetLike = { tagName?: string; type?: string; isContentEditable?: boolean; role?: string | null } | null;

/** Whether a key press should be left alone: a modifier is held, or the student is typing in a field. */
export function ignoreKey(e: KeyLike, target: TargetLike) {
    if (e.metaKey || e.ctrlKey || e.altKey) return true;
    if (!target) return false;
    if (target.isContentEditable) return true;
    const tag = target.tagName ?? "";
    if (tag === "TEXTAREA" || tag === "SELECT") return true;
    if (tag === "INPUT") return target.type !== "radio" && target.type !== "checkbox";
    return false;
}

/**
 * Enter checks the answer unless focus is on something Enter already activates (a button, link, <summary>, field
 * or a control with such a role). Option radios are buttons too (role="radio"), and Enter does nothing on them, so
 * it checks there.
 */
export function enterChecks(target: TargetLike) {
    if (target?.role === "radio") return true;
    const tag = target?.tagName ?? "";
    if (INTERACTIVE_TAGS.has(tag)) return false;
    return !target?.role || !INTERACTIVE_ROLES.has(target.role);
}

// Elements where Enter already means something (open a <details>, follow a link, press a button, toggle a box).
const INTERACTIVE_TAGS = new Set(["A", "BUTTON", "SUMMARY", "INPUT", "SELECT", "TEXTAREA"]);
const INTERACTIVE_ROLES = new Set(["button", "link", "checkbox", "switch", "tab", "menuitem", "option", "combobox"]);
