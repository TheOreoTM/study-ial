import { z } from "zod";

// --- Zod Schemas ---

export const SubjectSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string().optional(),
});

export const UnitSchema = z.object({
    id: z.string(),
    subjectId: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string().optional(),
});

export const TopicSchema = z.object({
    id: z.string(),
    subjectId: z.string(),
    unitId: z.string(),
    code: z.string(),
    name: z.string(),
    slug: z.string(),
    parentTopicId: z.string().optional(),
});

// Recursive type for topic hierarchy
export type TopicWithChildren = z.infer<typeof TopicSchema> & {
    children: TopicWithChildren[];
};

// --- TypeScript Types (Inferred) ---

export type Subject = z.infer<typeof SubjectSchema>;
export type Unit = z.infer<typeof UnitSchema>;
export type Topic = z.infer<typeof TopicSchema>;

// --- Static Data (Read-Only) ---

export const SUBJECTS: Subject[] = [
    { id: "phys", code: "PHYS", name: "Physics", description: "Study of matter and energy" },
    { id: "chem", code: "CHEM", name: "Chemistry", description: "Study of substances and their properties" },
    { id: "biol", code: "BIOL", name: "Biology", description: "Study of living organisms" },
    { id: "math", code: "MATH", name: "Mathematics", description: "Study of numbers, quantities, and shapes" },
    { id: "islm", code: "ISLM", name: "Islam", description: "Islamic Studies" },
    { id: "dhiv", code: "DHIV", name: "Dhivehi", description: "Dhivehi Language" },
];

export const UNITS: Unit[] = [
    // Example Units - Populate as needed
    { id: "phys-u1", subjectId: "phys", code: "U1", name: "Mechanics and Materials" },
    { id: "phys-u2", subjectId: "phys", code: "U2", name: "Waves and Electricity" },
];

export const TOPICS: Topic[] = [
    // Example Topics - Populate as needed
    { id: "phys-t1", subjectId: "phys", unitId: "phys-u1", code: "1.1", name: "Motion", slug: "motion" },
];

// Validate data at runtime (optional, but good for sanity checks during dev)
if (process.env.NODE_ENV === "development") {
    z.array(SubjectSchema).parse(SUBJECTS as unknown);
    z.array(UnitSchema).parse(UNITS as unknown);
    z.array(TopicSchema).parse(TOPICS as unknown);
}

// --- Helper Functions ---

export function getSubjectByCode(code: string): Subject | undefined {
    return SUBJECTS.find((s) => s.code === code);
}

export function getUnitsBySubject(subjectId: string): Unit[] {
    return UNITS.filter((u) => u.subjectId === subjectId);
}

export function getTopicsByUnit(unitId: string): Topic[] {
    return TOPICS.filter((t) => t.unitId === unitId);
}

export function getTopicHierarchy(unitId: string): TopicWithChildren[] {
    const unitTopics = getTopicsByUnit(unitId);
    const topicMap = new Map<string, TopicWithChildren>();

    // Initialize map with all topics
    unitTopics.forEach((t) => {
        topicMap.set(t.id, { ...t, children: [] });
    });

    const rootTopics: TopicWithChildren[] = [];

    // Build hierarchy
    unitTopics.forEach((t) => {
        const topicWithChildren = topicMap.get(t.id)!;
        if (t.parentTopicId && topicMap.has(t.parentTopicId)) {
            const parent = topicMap.get(t.parentTopicId)!;
            parent.children.push(topicWithChildren);
        } else {
            rootTopics.push(topicWithChildren);
        }
    });

    return rootTopics;
}
