import { describe, expect, it } from "vitest";
import { canEditSittingQuestions, canViewSittingContent, deniedStatus } from "@/lib/papers/permissions";

const student = { id: "u1", role: "STUDENT" as const };
const other = { id: "u2", role: "STUDENT" as const };
const admin = { id: "a1", role: "ADMIN" as const };
const indexed = { ownerId: null };
const upload = { ownerId: "u1" };

describe("paper permissions", () => {
    it("never shows content to signed-out visitors", () => {
        expect(canViewSittingContent(null, indexed)).toBe(false);
        expect(canViewSittingContent(null, upload)).toBe(false);
        expect(deniedStatus(null)).toBe(401);
    });

    it("lets any signed-in student open public-index papers", () => {
        expect(canViewSittingContent(student, indexed)).toBe(true);
        expect(canViewSittingContent(other, indexed)).toBe(true);
    });

    it("keeps uploads private to their owner, admins included", () => {
        expect(canViewSittingContent(student, upload)).toBe(true);
        expect(canViewSittingContent(other, upload)).toBe(false);
        expect(canViewSittingContent(admin, upload)).toBe(false);
        expect(deniedStatus(other)).toBe(404);
    });

    it("lets owners edit uploads and admins edit the index", () => {
        expect(canEditSittingQuestions(student, upload)).toBe(true);
        expect(canEditSittingQuestions(other, upload)).toBe(false);
        expect(canEditSittingQuestions(student, indexed)).toBe(false);
        expect(canEditSittingQuestions(admin, indexed)).toBe(true);
        expect(canEditSittingQuestions(null, indexed)).toBe(false);
    });
});
