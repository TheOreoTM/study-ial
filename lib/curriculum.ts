export interface Subject {
    id: string;
    code: string;
    name: string;
    description?: string;
}

export interface Unit {
    id: string;
    subjectId: string;
    code: string;
    name: string;
    description?: string;
}

export interface Topic {
    id: string;
    subjectId: string;
    unitId: string;
    code: string;
    name: string;
    slug: string;
    parentTopicId?: string;
    children?: Topic[];
}

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

// Helper functions
export function getSubjectByCode(code: string): Subject | undefined {
    return SUBJECTS.find((s) => s.code === code);
}

export function getUnitsBySubject(subjectId: string): Unit[] {
    return UNITS.filter((u) => u.subjectId === subjectId);
}

export function getTopicsByUnit(unitId: string): Topic[] {
    return TOPICS.filter((t) => t.unitId === unitId);
}
