import {
    pgTable,
    text,
    integer,
    timestamp,
    varchar,
    boolean,
    jsonb,
    uuid,
    index,
    numeric,
    pgEnum,
    vector,
} from "drizzle-orm/pg-core";

// Enums
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard", "very_hard"]);

export const questionTypeEnum = pgEnum("question_type", [
    "mcq",
    "structured",
    "essay",
    "graph",
    "table",
    "mixed",
    "diagram",
    "calculation",
]);

export const taskTypeEnum = pgEnum("task_type", ["read", "revise", "practice_questions", "mock_paper", "review"]);

export const statusEnum = pgEnum("status", ["pending", "in_progress", "done", "skipped"]);

export const progressStatusEnum = pgEnum("progress_status", ["not_attempted", "attempted", "correct", "incorrect"]);

export const assetTypeEnum = pgEnum("asset_type", ["diagram", "graph", "table_image", "formula_image", "photo"]);

// Core subjects and topics
export const subjects = pgTable("subjects", {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const units = pgTable("units", {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectId: uuid("subject_id")
        .notNull()
        .references(() => subjects.id, { onDelete: "cascade" }),
    code: varchar("code", { length: 50 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const topics = pgTable(
    "topics",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        subjectId: uuid("subject_id")
            .notNull()
            .references(() => subjects.id, { onDelete: "cascade" }),
        unitId: uuid("unit_id")
            .notNull()
            .references(() => units.id, { onDelete: "cascade" }),
        slug: varchar("slug", { length: 150 }).notNull(),
        name: varchar("name", { length: 100 }).notNull(),
        parentTopicId: uuid("parent_topic_id"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        subjectUnitIdx: index("topics_subject_unit_idx").on(table.subjectId, table.unitId),
        slugIdx: index("topics_slug_idx").on(table.slug),
    })
);

// Past papers metadata
export const sourcePapers = pgTable(
    "source_papers",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        subjectId: uuid("subject_id")
            .notNull()
            .references(() => subjects.id, { onDelete: "cascade" }),
        year: integer("year").notNull(),
        session: varchar("session", { length: 20 }).notNull(), // "jan", "may", "sep"
        variant: integer("variant"), // 1, 2, 3, etc.
        paper: integer("paper"), // for subjects with multiple papers
        storageUrl: text("storage_url").notNull(),
        markingSchemeUrl: text("marking_scheme_url"),
        pageCount: integer("page_count"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        subjectYearSessionIdx: index("papers_subject_year_session_idx").on(table.subjectId, table.year, table.session),
    })
);

// Questions core
export const questions = pgTable(
    "questions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        subjectId: uuid("subject_id")
            .notNull()
            .references(() => subjects.id, { onDelete: "cascade" }),
        unitId: uuid("unit_id").references(() => units.id, { onDelete: "set null" }),
        primaryTopicId: uuid("primary_topic_id")
            .notNull()
            .references(() => topics.id, { onDelete: "restrict" }),
        difficulty: difficultyEnum("difficulty").default("medium").notNull(),
        questionType: questionTypeEnum("question_type").default("mixed").notNull(),
        hasDiagram: boolean("has_diagram").default(false).notNull(),
        hasMath: boolean("has_math").default(false).notNull(),
        hasTable: boolean("has_table").default(false).notNull(),
        embedding: vector("embedding", { dimensions: 768 }), // Gemini embedding dimension
        metadata: jsonb("metadata"), // tags, skills, examiner keywords, etc.
        sourcePaperId: uuid("source_paper_id").references(() => sourcePapers.id, {
            onDelete: "set null",
        }),
        sourcePage: integer("source_page"),
        sourceQuestionNumber: varchar("source_question_number", { length: 20 }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        subjectTopicIdx: index("questions_subject_topic_idx").on(table.subjectId, table.primaryTopicId),
        difficultyIdx: index("questions_difficulty_idx").on(table.difficulty),
        sourceIdx: index("questions_source_idx").on(table.sourcePaperId, table.sourceQuestionNumber),
    })
);

// Question parts (for multi-part questions)
export const questionParts = pgTable(
    "question_parts",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        questionId: uuid("question_id")
            .notNull()
            .references(() => questions.id, { onDelete: "cascade" }),
        label: varchar("label", { length: 10 }).notNull(), // "a", "b", "i", "ii", etc.
        promptPlain: text("prompt_plain"), // plain text version
        promptRich: jsonb("prompt_rich"), // rich format with math, images, tables
        marks: integer("marks"),
        answerExplanationRich: jsonb("answer_explanation_rich"), // worked solution
        order: integer("order").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        questionIdx: index("question_parts_question_idx").on(table.questionId),
    })
);

// Multiple choice options
export const answerOptions = pgTable(
    "answer_options",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        questionPartId: uuid("question_part_id")
            .notNull()
            .references(() => questionParts.id, { onDelete: "cascade" }),
        label: varchar("label", { length: 10 }).notNull(), // "A", "B", "C", "D"
        contentRich: jsonb("content_rich").notNull(), // rich format
        contentPlain: text("content_plain"), // plain text fallback
        isCorrect: boolean("is_correct").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        questionPartIdx: index("answer_options_question_part_idx").on(table.questionPartId),
    })
);

// Question assets (diagrams, graphs, tables, etc.)
export const questionAssets = pgTable(
    "question_assets",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        questionId: uuid("question_id")
            .notNull()
            .references(() => questions.id, { onDelete: "cascade" }),
        questionPartId: uuid("question_part_id").references(() => questionParts.id, { onDelete: "cascade" }),
        type: assetTypeEnum("type").notNull(),
        storageUrl: text("storage_url").notNull(),
        altText: text("alt_text"), // AI-generated description
        bboxData: jsonb("bbox_data"), // page/coords if from PDF { page, x, y, width, height }
        metadata: jsonb("metadata"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        questionIdx: index("question_assets_question_idx").on(table.questionId),
    })
);

// Study plans
export const studyPlans = pgTable(
    "study_plans",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: varchar("user_id").notNull(), // from Clerk
        name: varchar("name", { length: 200 }).notNull(),
        subjectId: uuid("subject_id").references(() => subjects.id, {
            onDelete: "set null",
        }),
        startDate: timestamp("start_date").notNull(),
        endDate: timestamp("end_date").notNull(),
        totalTargetHours: numeric("total_target_hours", { precision: 10, scale: 2 }),
        settings: jsonb("settings"), // exam date, preferred days, daily max hours, focus topics, etc.
        generatedByModel: varchar("generated_by_model", { length: 100 }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        userIdx: index("study_plans_user_idx").on(table.userId),
    })
);

// Study plan items (tasks within a plan)
export const studyPlanItems = pgTable(
    "study_plan_items",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        planId: uuid("plan_id")
            .notNull()
            .references(() => studyPlans.id, { onDelete: "cascade" }),
        subjectId: uuid("subject_id")
            .notNull()
            .references(() => subjects.id, { onDelete: "restrict" }),
        topicIds: jsonb("topic_ids"), // array of UUID strings
        questionIds: jsonb("question_ids"), // array of question UUIDs for this task
        taskType: taskTypeEnum("task_type").notNull(),
        status: statusEnum("status").default("pending").notNull(),
        dueDate: timestamp("due_date").notNull(),
        targetQuestionsCount: integer("target_questions_count"),
        targetMinutes: integer("target_minutes"),
        metadata: jsonb("metadata"), // specific instructions like "P1 Jan 2023 Q1-Q5"
        completedAt: timestamp("completed_at"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        planIdx: index("study_plan_items_plan_idx").on(table.planId),
        dueIdx: index("study_plan_items_due_idx").on(table.dueDate),
    })
);

// User question progress
export const userQuestionProgress = pgTable(
    "user_question_progress",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: varchar("user_id").notNull(), // from Clerk
        questionId: uuid("question_id")
            .notNull()
            .references(() => questions.id, { onDelete: "cascade" }),
        status: progressStatusEnum("status").default("not_attempted").notNull(),
        lastAnsweredAt: timestamp("last_answered_at"),
        timesAttempted: integer("times_attempted").default(0).notNull(),
        timesCorrect: integer("times_correct").default(0).notNull(),
        difficultyEstimate: numeric("difficulty_estimate", {
            precision: 3,
            scale: 2,
        }), // personalized difficulty (0-1)
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        userQuestionIdx: index("user_progress_user_question_idx").on(table.userId, table.questionId),
        userIdx: index("user_progress_user_idx").on(table.userId),
    })
);

// Ingestion jobs (for tracking bulk imports)
export const ingestionJobs = pgTable(
    "ingestion_jobs",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        sourcePaperId: uuid("source_paper_id")
            .notNull()
            .references(() => sourcePapers.id, { onDelete: "cascade" }),
        status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, processing, completed, failed
        totalQuestions: integer("total_questions"),
        processedQuestions: integer("processed_questions").default(0).notNull(),
        errorLog: jsonb("error_log"), // array of errors
        rawGeminiOutput: jsonb("raw_gemini_output"), // for auditing
        startedAt: timestamp("started_at"),
        completedAt: timestamp("completed_at"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        statusIdx: index("ingestion_jobs_status_idx").on(table.status),
        paperIdx: index("ingestion_jobs_paper_idx").on(table.sourcePaperId),
    })
);

// Type exports for convenience
export type Subject = typeof subjects.$inferSelect;
export type SubjectInsert = typeof subjects.$inferInsert;

export type Unit = typeof units.$inferSelect;
export type UnitInsert = typeof units.$inferInsert;

export type Topic = typeof topics.$inferSelect;
export type TopicInsert = typeof topics.$inferInsert;

export type SourcePaper = typeof sourcePapers.$inferSelect;
export type SourcePaperInsert = typeof sourcePapers.$inferInsert;

export type Question = typeof questions.$inferSelect;
export type QuestionInsert = typeof questions.$inferInsert;

export type QuestionPart = typeof questionParts.$inferSelect;
export type QuestionPartInsert = typeof questionParts.$inferInsert;

export type AnswerOption = typeof answerOptions.$inferSelect;
export type AnswerOptionInsert = typeof answerOptions.$inferInsert;

export type QuestionAsset = typeof questionAssets.$inferSelect;
export type QuestionAssetInsert = typeof questionAssets.$inferInsert;

export type StudyPlan = typeof studyPlans.$inferSelect;
export type StudyPlanInsert = typeof studyPlans.$inferInsert;

export type StudyPlanItem = typeof studyPlanItems.$inferSelect;
export type StudyPlanItemInsert = typeof studyPlanItems.$inferInsert;

export type UserQuestionProgress = typeof userQuestionProgress.$inferSelect;
export type UserQuestionProgressInsert = typeof userQuestionProgress.$inferInsert;

export type IngestionJob = typeof ingestionJobs.$inferSelect;
export type IngestionJobInsert = typeof ingestionJobs.$inferInsert;
