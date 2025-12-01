-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "source_papers" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "session" TEXT NOT NULL,
    "variant" INTEGER,
    "paper" INTEGER,
    "storageUrl" TEXT NOT NULL,
    "markingSchemeUrl" TEXT,
    "pageCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "source_papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "unitId" TEXT,
    "primaryTopicId" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "questionType" "QuestionType" NOT NULL DEFAULT 'MIXED',
    "hasDiagram" BOOLEAN NOT NULL DEFAULT false,
    "hasMath" BOOLEAN NOT NULL DEFAULT false,
    "hasTable" BOOLEAN NOT NULL DEFAULT false,
    "embedding" vector(1536),
    "metadata" JSONB,
    "sourcePaperId" TEXT,
    "sourcePage" INTEGER,
    "sourceQuestionNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_parts" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "promptPlain" TEXT,
    "promptRich" JSONB,
    "marks" INTEGER,
    "answerExplanationRich" JSONB,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_options" (
    "id" TEXT NOT NULL,
    "questionPartId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "contentRich" JSONB NOT NULL,
    "contentPlain" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_assets" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionPartId" TEXT,
    "type" "AssetType" NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "altText" TEXT,
    "bboxData" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subjectId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalTargetHours" DECIMAL(10,2),
    "settings" JSONB,
    "generatedByModel" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_plan_items" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "topicIds" JSONB,
    "questionIds" JSONB,
    "taskType" "TaskType" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "targetQuestionsCount" INTEGER,
    "targetMinutes" INTEGER,
    "metadata" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_plan_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_question_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_ATTEMPTED',
    "lastAnsweredAt" TIMESTAMP(3),
    "timesAttempted" INTEGER NOT NULL DEFAULT 0,
    "timesCorrect" INTEGER NOT NULL DEFAULT 0,
    "difficultyEstimate" DECIMAL(3,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_question_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingestion_jobs" (
    "id" TEXT NOT NULL,
    "sourcePaperId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalQuestions" INTEGER,
    "processedQuestions" INTEGER NOT NULL DEFAULT 0,
    "errorLog" JSONB,
    "rawGeminiOutput" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingestion_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "pageCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_chunks" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(1536),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "source_papers_subjectId_year_session_idx" ON "source_papers"("subjectId", "year", "session");

-- CreateIndex
CREATE INDEX "questions_subjectId_primaryTopicId_idx" ON "questions"("subjectId", "primaryTopicId");

-- CreateIndex
CREATE INDEX "questions_difficulty_idx" ON "questions"("difficulty");

-- CreateIndex
CREATE INDEX "questions_sourcePaperId_sourceQuestionNumber_idx" ON "questions"("sourcePaperId", "sourceQuestionNumber");

-- CreateIndex
CREATE INDEX "question_parts_questionId_idx" ON "question_parts"("questionId");

-- CreateIndex
CREATE INDEX "answer_options_questionPartId_idx" ON "answer_options"("questionPartId");

-- CreateIndex
CREATE INDEX "question_assets_questionId_idx" ON "question_assets"("questionId");

-- CreateIndex
CREATE INDEX "study_plans_userId_idx" ON "study_plans"("userId");

-- CreateIndex
CREATE INDEX "study_plan_items_planId_idx" ON "study_plan_items"("planId");

-- CreateIndex
CREATE INDEX "study_plan_items_dueDate_idx" ON "study_plan_items"("dueDate");

-- CreateIndex
CREATE INDEX "user_question_progress_userId_questionId_idx" ON "user_question_progress"("userId", "questionId");

-- CreateIndex
CREATE INDEX "user_question_progress_userId_idx" ON "user_question_progress"("userId");

-- CreateIndex
CREATE INDEX "ingestion_jobs_status_idx" ON "ingestion_jobs"("status");

-- CreateIndex
CREATE INDEX "ingestion_jobs_sourcePaperId_idx" ON "ingestion_jobs"("sourcePaperId");

-- CreateIndex
CREATE INDEX "resources_userId_idx" ON "resources"("userId");

-- CreateIndex
CREATE INDEX "resource_chunks_resourceId_idx" ON "resource_chunks"("resourceId");

-- AddForeignKey
ALTER TABLE "source_papers" ADD CONSTRAINT "source_papers_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_primaryTopicId_fkey" FOREIGN KEY ("primaryTopicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_sourcePaperId_fkey" FOREIGN KEY ("sourcePaperId") REFERENCES "source_papers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_parts" ADD CONSTRAINT "question_parts_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_options" ADD CONSTRAINT "answer_options_questionPartId_fkey" FOREIGN KEY ("questionPartId") REFERENCES "question_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_assets" ADD CONSTRAINT "question_assets_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_assets" ADD CONSTRAINT "question_assets_questionPartId_fkey" FOREIGN KEY ("questionPartId") REFERENCES "question_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_items" ADD CONSTRAINT "study_plan_items_planId_fkey" FOREIGN KEY ("planId") REFERENCES "study_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_items" ADD CONSTRAINT "study_plan_items_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_question_progress" ADD CONSTRAINT "user_question_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_question_progress" ADD CONSTRAINT "user_question_progress_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingestion_jobs" ADD CONSTRAINT "ingestion_jobs_sourcePaperId_fkey" FOREIGN KEY ("sourcePaperId") REFERENCES "source_papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_chunks" ADD CONSTRAINT "resource_chunks_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
