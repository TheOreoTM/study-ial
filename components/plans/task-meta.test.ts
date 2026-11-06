import { describe, expect, it } from "vitest";
import { taskHref } from "./task-meta";

const topic = {
    id: "t1",
    name: "Motion",
    slug: "motion",
    unit: { code: "WPH11", name: "Mechanics", subject: { slug: "physics", name: "Physics" } },
};

describe("taskHref", () => {
    it("opens the topic for LEARN and practice for PRACTICE/REVIEW", () => {
        expect(taskHref({ type: "LEARN", topic })).toEqual({ href: "/subjects/physics/wph11/motion", label: "Open topic" });
        expect(taskHref({ type: "REVIEW", topic })).toEqual({ href: "/practice?topic=t1", label: "Practise" });
    });
    it("sends past papers to that unit's timed mock papers", () => {
        expect(taskHref({ type: "PAST_PAPER", topic: null, title: "WPH12 past paper #2 (part 1 of 2)" })).toEqual({
            href: "/mock#unit-wph12",
            label: "Sit a timed paper",
        });
        expect(taskHref({ type: "PAST_PAPER", topic: null, title: "Past paper" })).toEqual({
            href: "/mock",
            label: "Sit a timed paper",
        });
    });
    it("has nothing for a topic task whose topic was deleted", () => {
        expect(taskHref({ type: "PRACTICE", topic: null })).toBeNull();
    });
});
