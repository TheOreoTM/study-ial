import type { SeedQuestion, SeedSubject } from "./types";
import { physics } from "./physics";
import { otherSubjects } from "./other-subjects";
import { physicsQuestions } from "./questions/physics";

export const subjects: SeedSubject[] = [physics, ...otherSubjects];
export const questions: SeedQuestion[] = [...physicsQuestions];
