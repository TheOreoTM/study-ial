import type { Mastery } from "@/lib/mastery";
import type { Difficulty, QuestionType } from "@/lib/generated/prisma/enums";

/** What the client sees before answering — never includes the answer, mark scheme or explanation. */
export type PracticeQuestion = {
    id: string;
    type: QuestionType;
    difficulty: Difficulty;
    marks: number;
    stem: string;
    topicId: string;
    options: { id: string; label: string; text: string }[];
};

export type SessionTopic = {
    id: string;
    code: string;
    name: string;
    href: string;
    unitCode: string;
    before: Mastery;
};

export type MarkPointView = { text: string; marks: number };

export type MarkSchemeView = {
    points: MarkPointView[];
    notes: string[];
    explanation: string | null;
};

export type TopicMasteryUpdate = { topicId: string; mastery: Mastery };

export type ActionResult<T> = ({ ok: true } & T) | { ok: false; error: string };

export type McqResult = ActionResult<
    {
        correct: boolean;
        correctOptionId: string | null;
        marksAwarded: number;
        explanation: string | null;
    } & TopicMasteryUpdate
>;

export type RevealResult = ActionResult<MarkSchemeView>;

export type SelfMarkResult = ActionResult<{ marksAwarded: number } & TopicMasteryUpdate>;

export type AiMarkView = ActionResult<
    {
        marksAwarded: number;
        feedback: string;
        points: { point: string; awarded: boolean; comment: string }[];
        markScheme: MarkSchemeView;
        remaining: number;
    } & TopicMasteryUpdate
>;
