export type FocusTopic = { id: string; code: string; name: string; unitCode: string };
export type FocusTask = { id: string; title: string; done: boolean; topic: FocusTopic | null };
export type FocusTopicGroup = { unitCode: string; unitName: string; topics: FocusTopic[] };

export type LogFocusInput = { minutes: number; startedAt: string; taskId?: string | null; topicId?: string | null };
export type FocusActionResult = { ok: true } | { ok: false; error: string };
