export type PickerUnit = { id: string; code: string; name: string; topicCount: number };
export type PickerSubject = { id: string; name: string; code: string; isLocal: boolean; units: PickerUnit[] };

/** One chosen unit and its (approximate) exam date, "YYYY-MM-DD", or null for "not sure yet". */
export type UnitChoice = { unitId: string; examDate: string | null };

type SubjectRow = {
    id: string;
    name: string;
    code: string;
    isLocal: boolean;
    units: { id: string; code: string; name: string; _count: { topics: number } }[];
};

/** Shape `getSubjects()` (lib/queries/curriculum) into plain props for the client pickers. */
export function toPickerSubjects(subjects: SubjectRow[]): PickerSubject[] {
    return subjects.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        isLocal: s.isLocal,
        units: s.units.map((u) => ({ id: u.id, code: u.code, name: u.name, topicCount: u._count.topics })),
    }));
}
