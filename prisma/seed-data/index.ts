import type { SeedFlashcard, SeedQuestion, SeedSubject } from "./types";
import { physics } from "./physics";
import { otherSubjects } from "./other-subjects";
import { physicsQuestions } from "./questions/physics";
import { chemistryQuestions } from "./questions/chemistry";
import { biologyQuestions } from "./questions/biology";
import { mathematicsPureQuestions } from "./questions/mathematics-pure";
import { mathematicsAppliedQuestions } from "./questions/mathematics-applied";
import { furtherMathematicsQuestions } from "./questions/further-mathematics";
import { physicsFlashcards } from "./flashcards/physics";
import { chemistryFlashcards } from "./flashcards/chemistry";
import { biologyFlashcards } from "./flashcards/biology";
import { mathematicsPureFlashcards } from "./flashcards/mathematics-pure";
import { mathematicsAppliedFlashcards } from "./flashcards/mathematics-applied";
import { furtherMathematicsFlashcards } from "./flashcards/further-mathematics";

export const subjects: SeedSubject[] = [physics, ...otherSubjects];

// Physics is the hand-checked, published bank. Every other subject is seeded as DRAFT for admin review.
export const questions: SeedQuestion[] = [
    ...physicsQuestions,
    ...chemistryQuestions,
    ...biologyQuestions,
    ...mathematicsPureQuestions,
    ...mathematicsAppliedQuestions,
    ...furtherMathematicsQuestions,
];

// Flashcards are seeded as DRAFT too (see prisma/seed.ts); admins publish them per topic.
export const flashcards: SeedFlashcard[] = [
    ...physicsFlashcards,
    ...chemistryFlashcards,
    ...biologyFlashcards,
    ...mathematicsPureFlashcards,
    ...mathematicsAppliedFlashcards,
    ...furtherMathematicsFlashcards,
];
