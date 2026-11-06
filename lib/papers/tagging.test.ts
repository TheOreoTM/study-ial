import { describe, expect, it } from "vitest";
import { buildTagger } from "@/lib/papers/tagging";

const topics = [
    { id: "alg", name: "Algebra and functions", specPoints: [] },
    { id: "coord", name: "Coordinate geometry in the (x, y) plane", specPoints: [] },
    { id: "trig", name: "Trigonometry", specPoints: [] },
    { id: "diff", name: "Differentiation", specPoints: [] },
    { id: "int", name: "Integration", specPoints: [] },
];
const tag = buildTagger(topics);

describe("topic tagger", () => {
    it("tags clear-cut parts", () => {
        expect(tag("Find 8x3 6 x 52x3 dx giving your answer in simplest form")?.topicId).toBe("int");
        expect(tag("find the size of angle OAB, giving your answer in radians to 4 significant figures")?.topicId).toBe("trig");
        expect(tag("Find the equation of the line l2 which is perpendicular to l1 and passes through A")?.topicId).toBe("coord");
        expect(tag("Find dy/dx and hence the equation of the tangent to the curve")?.topicId).toBe("diff");
        expect(tag("Find the range of values of k for which the quadratic has no real roots, using the discriminant")?.topicId).toBe("alg");
    });

    it("leaves ambiguous or empty text untagged", () => {
        expect(tag("")).toBeNull();
        expect(tag("Write down the value of p")).toBeNull();
    });

    it("uses specification points when topics have them", () => {
        const t = buildTagger([
            { id: "waves", name: "Waves", specPoints: ["understand the terms amplitude, frequency, period and wavelength"] },
            { id: "dc", name: "DC electricity", specPoints: ["use I = V/R and understand resistivity"] },
        ]);
        expect(t("State what is meant by the wavelength and amplitude of a wave")?.topicId).toBe("waves");
        expect(t("Calculate the resistivity of the wire")?.topicId).toBe("dc");
    });
});
