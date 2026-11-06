import { describe, expect, it } from "vitest";
import { paperSubjectBySlug } from "@/lib/papers/config";
import { extractAlgoliaConfig, mapPearsonHit, pearsonUrl } from "@/lib/papers/sources/pearson";

const maths = paperSubjectBySlug("mathematics")!;
const now = new Date("2026-11-06T00:00:00Z");
const cats = (...c: string[]) => c.map((x) => `Pearson-UK:${x}`);

describe("extractAlgoliaConfig", () => {
    it("reads the hidden inputs the course-materials page embeds", () => {
        const html = `<input type="hidden" value="f79c7a8352e9ffbdaec387bf43612ee6" class="algoliaAPIKey"/>
            <input type="hidden" value="L639T95U5A" class="algoliaAppId"/>
            <input type="hidden" value="qualifications-uk_LIVE_master-content" class="algoliaIndexName"/>`;
        expect(extractAlgoliaConfig(html)).toEqual({
            appId: "L639T95U5A",
            apiKey: "f79c7a8352e9ffbdaec387bf43612ee6",
            indexName: "qualifications-uk_LIVE_master-content",
        });
        expect(extractAlgoliaConfig("<html></html>")).toBeNull();
    });
});

describe("pearsonUrl", () => {
    it("keeps full URLs and encodes legacy paths with spaces", () => {
        expect(pearsonUrl("/content/dam/pdf/International Advanced Level/Mathematics/2013/Exam materials/WFM02_01_que_20180607.pdf")).toBe(
            "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2013/Exam%20materials/WFM02_01_que_20180607.pdf",
        );
        // Already-encoded input isn't double-encoded
        expect(pearsonUrl("/content/dam/pdf/International%20Advanced%20Level/a.pdf")).toBe(
            "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/a.pdf",
        );
    });
});

describe("mapPearsonHit", () => {
    const base = "/content/dam/pdf/International-Advanced-Level/Mathematics/2018/Exam-materials/";

    it("maps an open question paper with the series from the facet", () => {
        const r = mapPearsonHit(
            {
                url: `${base}wma11-01-rms-20230112.pdf`,
                title: "Mark scheme - Unit 1 (WMA11) - October 2022",
                category: cats("Document-Type/Mark-scheme", "Exam-Series/October-2022", "secure-content/silver"),
            },
            maths,
            "2018",
            now,
        );
        expect(r && "candidate" in r && r.candidate).toMatchObject({
            source: "PEARSON",
            unitCode: "WMA11",
            paperCode: "01",
            type: "MS",
            year: 2022,
            series: "oct",
            spec: "2018",
        });
    });

    it("skips restricted paths without looking further", () => {
        const r = mapPearsonHit(
            {
                url: "/content/dam/secure/silver/all-uk-and-international/international-advanced-level/mathematics/2018/exam-materials/wma14-01a-que-20260610.pdf",
                title: "Question paper - Unit 4A (WMA14) - June 2026",
                category: cats("Document-Type/Question-paper", "Exam-Series/June-2026"),
            },
            maths,
            "2018",
            now,
        );
        expect(r && "skip" in r && r.skip.reason).toBe("restricted-path");
    });

    it("skips open-path files still inside the restricted window", () => {
        const r = mapPearsonHit(
            { url: `${base}wma11-01-que-20260109.pdf`, title: "x", category: cats("Document-Type/Question-paper", "Exam-Series/January-2026") },
            maths,
            "2018",
            now,
        );
        expect(r && "skip" in r && r.skip.reason).toBe("restricted-window");
    });

    it("ignores other subjects' units and UK A Level papers", () => {
        expect(
            mapPearsonHit({ url: `${base}wfm01-01-que-20240111.pdf`, title: "", category: cats("Document-Type/Question-paper") }, maths, "2018", now),
        ).toBeNull();
        expect(
            mapPearsonHit({ url: "/content/dam/pdf/A-Level/Mathematics/2013/Exam-materials/6663_01_que_20160517.pdf", title: "Question paper - Unit C1 (6663)" }, maths, "2013", now),
        ).toBeNull();
    });

    it("skips unused papers and falls back to the title for free-form names", () => {
        const unused = mapPearsonHit(
            { url: `${base}WMA14_01_Jan22_UNUSED.pdf`, title: "Unused Question paper - Unit 4 (WMA14) - January 2022", category: cats("Document-Type/Question-paper") },
            maths,
            "2018",
            now,
        );
        expect(unused && "skip" in unused && unused.skip.reason).toBe("not-a-paper");
        const legacy = mapPearsonHit(
            {
                url: "/content/dam/pdf/International Advanced Level/Mathematics/2013/Exam materials/Mark-scheme-Paper-C12-(WMA01)-June-2014.pdf",
                title: "Mark scheme - Paper C12 (WMA01) - June 2014",
                category: cats("Document-Type/Mark-scheme", "Exam-Series/June-2014"),
            },
            maths,
            "2013",
            now,
        );
        expect(legacy && "candidate" in legacy && legacy.candidate).toMatchObject({ unitCode: "WMA01", type: "MS", year: 2014, series: "jun" });
    });

    it("marks updated re-issues as preferred", () => {
        const r = mapPearsonHit(
            { url: `${base}wfm03-01-que-20230405-updated.pdf`, title: "Question paper - Unit 3 (WFM03) - January 2023 (Updated)", category: cats("Document-Type/Question-paper", "Exam-Series/January-2023") },
            paperSubjectBySlug("further-mathematics")!,
            "2018",
            now,
        );
        expect(r && "candidate" in r && r.candidate.preferred).toBe(true);
    });
});
