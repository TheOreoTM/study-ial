import { describe, expect, it } from "vitest";
import {
    docTypeFromFacet,
    findSittingInText,
    paperLabel,
    parseCompactDate,
    parseListingTitle,
    parsePearsonFilename,
    parseSeriesFacet,
    sittingOrdinal,
} from "@/lib/papers/filename";

describe("parsePearsonFilename", () => {
    it("parses 2018-spec filenames", () => {
        expect(parsePearsonFilename("wma11-01-que-20250110.pdf")).toEqual({
            unitCode: "WMA11",
            paperCode: "01",
            type: "QP",
            publishedAt: new Date(Date.UTC(2025, 0, 10)),
            updated: false,
            unused: false,
        });
        expect(parsePearsonFilename("wma11-01a-rms-20250814.pdf")).toMatchObject({ paperCode: "01a", type: "MS" });
        expect(parsePearsonFilename("wma12-01r-pef-20240815.pdf")).toMatchObject({ paperCode: "01r", type: "ER" });
    });

    it("parses older underscore filenames and the msc code", () => {
        expect(parsePearsonFilename("WME02_01_pef_20220303.pdf")).toMatchObject({ unitCode: "WME02", type: "ER" });
        expect(parsePearsonFilename("WME03_01_msc_20150305.pdf")).toMatchObject({ unitCode: "WME03", type: "MS" });
    });

    it("handles Pearson's irregular names", () => {
        expect(parsePearsonFilename("wfm03-01-que-20230405-updated.pdf")).toMatchObject({ type: "QP", updated: true });
        expect(parsePearsonFilename("wma12-01-mcs-20190815.pdf")).toMatchObject({ type: "MS" });
        expect(parsePearsonFilename("wfm01-01-msc-202010113.pdf")).toMatchObject({ type: "MS", publishedAt: null });
        expect(parsePearsonFilename("ial-wma11-01-oct19.pdf")).toMatchObject({ unitCode: "WMA11", type: null });
        expect(parsePearsonFilename("WMA14_01_Jan22_UNUSED.pdf")).toMatchObject({ unused: true });
    });

    it("rejects non-IAL and non-PDF files", () => {
        expect(parsePearsonFilename("6663_01_que_20160517.pdf")).toBeNull();
        expect(parsePearsonFilename("modified-papers-wdm1-june-2021.zip")).toBeNull();
        expect(parsePearsonFilename("wma11-01-que-20250110.doc")).toBeNull();
    });

    it("keeps the filename date as the publication date, not the series", () => {
        // October 2022 mark scheme, published January 2023
        expect(parsePearsonFilename("wma11-01-rms-20230112.pdf")?.publishedAt?.toISOString()).toBe("2023-01-12T00:00:00.000Z");
    });
});

describe("parseCompactDate", () => {
    it("rejects impossible dates", () => {
        expect(parseCompactDate("20250231")).toBeNull();
        expect(parseCompactDate("2025011")).toBeNull();
    });
});

describe("series parsing", () => {
    it("reads the Algolia facet", () => {
        expect(parseSeriesFacet("October-2023")).toEqual({ year: 2023, series: "oct" });
        expect(parseSeriesFacet("January-2019")).toEqual({ year: 2019, series: "jan" });
        expect(parseSeriesFacet("June-2026")).toEqual({ year: 2026, series: "jun" });
        expect(parseSeriesFacet("Spring-2020")).toBeNull();
    });

    it("finds a sitting in titles and cover pages", () => {
        expect(findSittingInText("Mark scheme - Unit 1 (WMA11) - October 2022")).toEqual({ year: 2022, series: "oct" });
        expect(findSittingInText("Monday 8 January 2024 Morning (Time: 1 hour 30 minutes)")).toEqual({
            year: 2024,
            series: "jan",
        });
        expect(findSittingInText("Mark Scheme (Results) Summer 2023 Pearson Edexcel")).toEqual({ year: 2023, series: "jun" });
        expect(findSittingInText("May/June 2019")).toEqual({ year: 2019, series: "jun" });
        expect(findSittingInText("Autumn 2021")).toEqual({ year: 2021, series: "oct" });
        expect(findSittingInText("no date here")).toBeNull();
    });

    it("orders sittings chronologically", () => {
        expect(sittingOrdinal({ year: 2024, series: "oct" })).toBeGreaterThan(sittingOrdinal({ year: 2024, series: "jun" }));
        expect(sittingOrdinal({ year: 2025, series: "jan" })).toBeGreaterThan(sittingOrdinal({ year: 2024, series: "oct" }));
    });
});

describe("listing metadata", () => {
    it("maps document types", () => {
        expect(docTypeFromFacet("Question-paper")).toBe("QP");
        expect(docTypeFromFacet("Mark-Scheme")).toBe("MS");
        expect(docTypeFromFacet("Examiner-Report")).toBe("ER");
        expect(docTypeFromFacet("Modified-question-paper")).toBeNull();
    });

    it("reads unit and variant from titles", () => {
        expect(parseListingTitle("Mark scheme - Paper C12 (WMA01) - June 2014")).toEqual({ unitCode: "WMA01", paperCode: "01" });
        expect(parseListingTitle("Question paper - Unit 1A ( WMA11) - June 2025")).toEqual({ unitCode: "WMA11", paperCode: "01a" });
        expect(parseListingTitle("Specification")).toBeNull();
    });

    it("labels papers", () => {
        expect(paperLabel("01")).toBe("Paper 1");
        expect(paperLabel("01a")).toBe("Paper 1A");
    });
});
