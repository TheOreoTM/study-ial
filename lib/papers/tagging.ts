// Topic tagging for past-paper parts (no AI): TF-IDF over each topic's name, summary and specification points, plus
// built-in hint words for common IAL topic names, matched against the part's text and its question's context.
// Pure and unit-tested. A part is only tagged when one topic clearly wins; otherwise it stays untagged.

export type TagTopic = { id: string; name: string; summary?: string | null; specPoints: string[] };

const STOP = new Set(
    "the a an and or of to in on for with by at is are be as that this from its their which find show given hence using use your answer form giving where values value exact simplest state write determine calculate explain describe".split(
        " ",
    ),
);

/** Words that signal a topic beyond its own name (lowercase keys match topic names by substring). */
const HINTS: Record<string, string[]> = {
    integration: ["integral", "integrate", "dx", "area", "region", "shaded", "bounded", "trapezium", "antiderivative"],
    // "ddyx" / "dydx" are how dy/dx comes out of a PDF's text layer
    differentiation: ["dy", "ddyx", "dydx", "derivative", "differentiate", "gradient", "tangent", "normal", "stationary", "turning", "increasing", "decreasing", "rate"],
    trigonometr: ["sin", "cos", "tan", "radians", "degrees", "sector", "arc", "angle", "triangle", "sine", "cosine", "identity"],
    "coordinate geometry": ["line", "lines", "gradient", "perpendicular", "parallel", "circle", "centre", "radius", "coordinates", "midpoint", "intersect"],
    "algebra and functions": ["quadratic", "discriminant", "roots", "simultaneous", "inequality", "indices", "surds", "rationalise", "sketch", "curve", "transformation", "translation", "stretch", "asymptote", "polynomial", "factor", "remainder"],
    sequences: ["sequence", "series", "arithmetic", "geometric", "term", "terms", "sum", "convergent", "recurrence"],
    binomial: ["binomial", "expansion", "expand", "coefficient", "ascending"],
    exponential: ["exponential", "logarithm", "logarithms", "log", "ln", "growth", "decay", "model"],
    vectors: ["vector", "vectors", "position", "magnitude", "unit", "direction"],
    proof: ["prove", "proof", "contradiction", "counter", "integer"],
    numerical: ["iteration", "iterative", "root", "newton", "raphson", "interval", "sign"],
    kinematics: ["velocity", "acceleration", "speed", "displacement", "distance", "time", "projected", "suvat"],
    motion: ["velocity", "acceleration", "speed", "displacement", "projectile", "graph"],
    forces: ["force", "forces", "friction", "tension", "resultant", "equilibrium", "plane", "inclined", "newton"],
    moments: ["moment", "moments", "rod", "beam", "pivot", "torque", "uniform"],
    momentum: ["momentum", "impulse", "collision", "collide", "coalesce", "speed"],
    probability: ["probability", "events", "independent", "venn", "tree", "mutually", "exclusive"],
    "statistical distributions": ["binomial", "distribution", "random", "variable", "probability"],
    "normal distribution": ["normal", "distribution", "mean", "standard", "deviation", "percentage"],
    correlation: ["correlation", "regression", "coefficient", "pmcc", "scatter"],
    "data presentation": ["mean", "median", "quartile", "histogram", "box", "outlier", "variance", "standard", "deviation", "frequency"],
};

function tokens(s: string) {
    return s
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ")
        .split(/\s+/)
        .map((w) => (w.length > 4 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w))
        .filter((w) => w.length > 1 && !STOP.has(w));
}

export function topicVocabulary(t: TagTopic) {
    const name = t.name.toLowerCase();
    const hints = Object.entries(HINTS)
        .filter(([k]) => name.includes(k))
        .flatMap(([, v]) => v);
    return [...tokens(t.name), ...tokens(t.name), ...tokens(t.summary ?? ""), ...t.specPoints.flatMap(tokens), ...hints.flatMap(tokens)];
}

export type Tagger = (text: string) => { topicId: string; score: number; margin: number } | null;

/** Builds a tagger for one unit's topics. */
export function buildTagger(topics: TagTopic[], opts: { minScore?: number; minMargin?: number } = {}): Tagger {
    const vocab = topics.map(() => new Map<string, number>());
    topics.forEach((t, i) => {
        for (const w of topicVocabulary(t)) vocab[i].set(w, (vocab[i].get(w) ?? 0) + 1);
    });
    // A word that appears in every topic tells us nothing
    const df = new Map<string, number>();
    for (const v of vocab) for (const w of v.keys()) df.set(w, (df.get(w) ?? 0) + 1);
    const idf = (w: string) => Math.log((topics.length + 1) / ((df.get(w) ?? 0) + 0.5));
    // At least one word unique to the topic: the best possible single-word score for this many topics
    const minScore = opts.minScore ?? 0.9 * Math.log((topics.length + 1) / 1.5);
    const minMargin = opts.minMargin ?? 0.25;

    return (text: string) => {
        const words = tokens(text);
        if (!words.length || !topics.length) return null;
        const scores = vocab.map((v) => {
            let s = 0;
            for (const w of new Set(words)) {
                const tf = v.get(w);
                if (tf) s += Math.min(tf, 3) * Math.max(0, idf(w));
            }
            return s;
        });
        const order = scores.map((s, i) => [s, i] as const).sort((a, b) => b[0] - a[0]);
        const [best, second] = order;
        if (!best || best[0] < minScore) return null;
        const margin = second ? (best[0] - second[0]) / best[0] : 1;
        if (margin < minMargin) return null;
        return { topicId: topics[best[1]].id, score: best[0], margin };
    };
}
