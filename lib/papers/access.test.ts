import { describe, expect, it } from "vitest";
import {
    checkPdfResponse,
    isAllowedByRobots,
    isInRestrictedWindow,
    isRestrictedPath,
    parseRobots,
    sittingEndDate,
} from "@/lib/papers/access";

const PEARSON_ROBOTS = `User-agent: *
Disallow: /templates/
Disallow: */secure/*
Disallow: */silver/*
Disallow: /content/dam/pdf/gcse/gcse-maths-summer-2018-exam-papers.zip
`;

describe("robots.txt", () => {
    const rules = parseRobots(PEARSON_ROBOTS, "StudyIAL-PaperIndexer/1.0");

    it("blocks Pearson's secure paths and allows the open ones", () => {
        expect(isAllowedByRobots(rules, "/content/dam/secure/silver/all-uk-and-international/x.pdf")).toBe(false);
        expect(isAllowedByRobots(rules, "/content/dam/pdf/International-Advanced-Level/Mathematics/2018/Exam-materials/wma11-01-que-20250110.pdf")).toBe(true);
        expect(isAllowedByRobots(rules, "/templates/page")).toBe(false);
        expect(isAllowedByRobots(rules, "/content/dam/pdf/International%20Advanced%20Level/Mathematics/2013/x.pdf")).toBe(true);
    });

    it("prefers the longest match, ties to Allow, and honours $", () => {
        const r = parseRobots("User-agent: *\nDisallow: /a/\nAllow: /a/open/\nDisallow: /*.zip$", "bot");
        expect(isAllowedByRobots(r, "/a/x")).toBe(false);
        expect(isAllowedByRobots(r, "/a/open/x")).toBe(true);
        expect(isAllowedByRobots(r, "/files/a.zip")).toBe(false);
        expect(isAllowedByRobots(r, "/files/a.zip?x=1")).toBe(true);
    });

    it("uses a group addressed to our agent over the * group", () => {
        const r = parseRobots("User-agent: *\nDisallow: /\n\nUser-agent: studyial-paperindexer\nDisallow: /private/", "StudyIAL-PaperIndexer/1.0");
        expect(isAllowedByRobots(r, "/public")).toBe(true);
        expect(isAllowedByRobots(r, "/private/x")).toBe(false);
    });

    it("allows everything when there are no rules", () => {
        expect(isAllowedByRobots(parseRobots("", "bot"), "/anything")).toBe(true);
    });
});

describe("restricted window", () => {
    const now = new Date("2026-11-06T00:00:00Z");

    it("knows when each series ends", () => {
        expect(sittingEndDate({ year: 2025, series: "oct" }).toISOString()).toBe("2025-10-31T00:00:00.000Z");
        expect(sittingEndDate({ year: 2026, series: "jan" }).toISOString()).toBe("2026-01-31T00:00:00.000Z");
    });

    it("keeps the last 12 months closed", () => {
        expect(isInRestrictedWindow({ year: 2026, series: "jun" }, now, 12)).toBe(true);
        expect(isInRestrictedWindow({ year: 2026, series: "jan" }, now, 12)).toBe(true);
        expect(isInRestrictedWindow({ year: 2025, series: "oct" }, now, 12)).toBe(false);
        expect(isInRestrictedWindow({ year: 2025, series: "oct" }, new Date("2026-10-15T00:00:00Z"), 12)).toBe(true);
        expect(isInRestrictedWindow({ year: 2025, series: "oct" }, now, 18)).toBe(true);
    });
});

describe("open-access checks", () => {
    it("treats secure/silver/login paths as restricted", () => {
        expect(isRestrictedPath("https://qualifications.pearson.com/content/dam/secure/silver/all-uk-and-international/a.pdf")).toBe(true);
        expect(isRestrictedPath("https://qualifications.pearson.com/en/login.html?resource=x")).toBe(true);
        expect(isRestrictedPath("https://qualifications.pearson.com/content/dam/pdf/International-Advanced-Level/a.pdf")).toBe(false);
        expect(isRestrictedPath("not a url")).toBe(true);
    });

    const pdf = new TextEncoder().encode("%PDF-1.7");
    const html = new TextEncoder().encode("<!DOCTYPE html>");
    const ok = "https://qualifications.pearson.com/content/dam/pdf/a.pdf";

    it("accepts a real PDF", () => {
        expect(checkPdfResponse({ status: 200, contentType: "application/pdf", finalUrl: ok, firstBytes: pdf })).toEqual({ ok: true });
    });

    it("rejects Pearson's HTML 404 page and login redirects", () => {
        expect(
            checkPdfResponse({ status: 200, contentType: "text/html", finalUrl: "https://qualifications.pearson.com/en/campaigns/404.html", firstBytes: html }),
        ).toEqual({ ok: false, reason: "not-pdf" });
        expect(
            checkPdfResponse({ status: 200, contentType: "application/pdf", finalUrl: "https://qualifications.pearson.com/content/dam/secure/silver/a.pdf", firstBytes: pdf }),
        ).toEqual({ ok: false, reason: "login-required" });
        expect(checkPdfResponse({ status: 403, contentType: "text/html", finalUrl: ok, firstBytes: html })).toEqual({
            ok: false,
            reason: "login-required",
        });
    });

    it("rejects a PDF content-type with non-PDF bytes", () => {
        expect(checkPdfResponse({ status: 200, contentType: "application/pdf", finalUrl: ok, firstBytes: html })).toEqual({
            ok: false,
            reason: "not-pdf",
        });
    });
});
