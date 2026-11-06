-- CreateEnum
CREATE TYPE "PaperSeries" AS ENUM ('JAN', 'JUN', 'OCT');

-- CreateEnum
CREATE TYPE "PaperDocType" AS ENUM ('QP', 'MS', 'ER');

-- CreateEnum
CREATE TYPE "PaperSource" AS ENUM ('PEARSON', 'PMT', 'UPLOAD');

-- CreateEnum
CREATE TYPE "ParseStatus" AS ENUM ('NONE', 'QUEUED', 'PARSING', 'NEEDS_REVIEW', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "PaperMarkMethod" AS ENUM ('SELF', 'AI', 'AI_ESTIMATED');

-- CreateEnum
CREATE TYPE "ExamMode" AS ENUM ('PRACTICE', 'TIMED');

-- CreateTable
CREATE TABLE "PaperSitting" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "spec" TEXT,
    "unitCode" TEXT NOT NULL,
    "unitId" TEXT,
    "paperCode" TEXT NOT NULL DEFAULT '01',
    "year" INTEGER,
    "series" "PaperSeries",
    "ownerId" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaperSitting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "papers" (
    "id" TEXT NOT NULL,
    "sittingId" TEXT NOT NULL,
    "type" "PaperDocType" NOT NULL,
    "source" "PaperSource" NOT NULL,
    "sourceUrl" TEXT,
    "sourceTitle" TEXT,
    "storageKey" TEXT NOT NULL,
    "pageKeys" TEXT[],
    "mime" TEXT NOT NULL DEFAULT 'application/pdf',
    "sha256" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "pageCount" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "parseStatus" "ParseStatus" NOT NULL DEFAULT 'NONE',
    "parseError" TEXT,
    "lastCheckedAt" TIMESTAMP(3),
    "lastCheckOk" BOOLEAN,
    "lastCheckNote" TEXT,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperParse" (
    "id" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "docType" "PaperDocType" NOT NULL,
    "engine" TEXT NOT NULL,
    "model" TEXT,
    "result" JSONB NOT NULL,
    "validation" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaperParse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperJob" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "state" JSONB,
    "error" TEXT,
    "userId" TEXT,
    "lockedAt" TIMESTAMP(3),
    "runAfter" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaperJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperQuestion" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "parentId" TEXT,
    "number" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "stem" TEXT NOT NULL,
    "marks" INTEGER NOT NULL DEFAULT 0,
    "page" INTEGER,
    "bbox" DOUBLE PRECISION[],
    "figures" JSONB NOT NULL DEFAULT '[]',
    "dependsOn" TEXT[],
    "markPoints" JSONB,
    "markNotes" TEXT,
    "examinerNotes" TEXT,
    "topicId" TEXT,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaperQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPaper" (
    "userId" TEXT NOT NULL,
    "sittingId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPaper_pkey" PRIMARY KEY ("userId","sittingId")
);

-- CreateTable
CREATE TABLE "PaperAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "sessionId" TEXT,
    "answer" TEXT,
    "imageKeys" TEXT[],
    "marksAwarded" INTEGER,
    "maxMarks" INTEGER NOT NULL,
    "method" "PaperMarkMethod",
    "feedback" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaperAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperExamSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sittingId" TEXT NOT NULL,
    "mode" "ExamMode" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "totalMarks" INTEGER,
    "maxMarks" INTEGER,
    "grade" TEXT,
    "summary" JSONB,

    CONSTRAINT "PaperExamSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperQuestionReview" (
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "dueDay" DATE NOT NULL,
    "intervalDays" INTEGER NOT NULL,
    "ease" DOUBLE PRECISION NOT NULL,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "lapses" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaperQuestionReview_pkey" PRIMARY KEY ("userId","questionId")
);

-- CreateTable
CREATE TABLE "GradeBoundary" (
    "id" TEXT NOT NULL,
    "unitCode" TEXT NOT NULL,
    "paperCode" TEXT NOT NULL DEFAULT '01',
    "year" INTEGER NOT NULL,
    "series" "PaperSeries" NOT NULL,
    "maxMark" INTEGER NOT NULL,
    "grades" JSONB NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GradeBoundary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiCallLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "feature" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "costMicros" INTEGER NOT NULL DEFAULT 0,
    "ok" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiCallLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaperSitting_subject_unitCode_year_idx" ON "PaperSitting"("subject", "unitCode", "year");

-- CreateIndex
CREATE INDEX "PaperSitting_ownerId_idx" ON "PaperSitting"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "papers_sourceUrl_key" ON "papers"("sourceUrl");

-- CreateIndex
CREATE INDEX "papers_sha256_idx" ON "papers"("sha256");

-- CreateIndex
CREATE INDEX "papers_sittingId_type_idx" ON "papers"("sittingId", "type");

-- CreateIndex
CREATE INDEX "papers_parseStatus_idx" ON "papers"("parseStatus");

-- CreateIndex
CREATE UNIQUE INDEX "PaperParse_sha256_docType_key" ON "PaperParse"("sha256", "docType");

-- CreateIndex
CREATE INDEX "PaperJob_status_runAfter_idx" ON "PaperJob"("status", "runAfter");

-- CreateIndex
CREATE INDEX "PaperJob_paperId_idx" ON "PaperJob"("paperId");

-- CreateIndex
CREATE INDEX "PaperQuestion_topicId_idx" ON "PaperQuestion"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "PaperQuestion_paperId_number_key" ON "PaperQuestion"("paperId", "number");

-- CreateIndex
CREATE INDEX "PaperAttempt_userId_createdAt_idx" ON "PaperAttempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PaperAttempt_userId_questionId_idx" ON "PaperAttempt"("userId", "questionId");

-- CreateIndex
CREATE INDEX "PaperAttempt_sessionId_idx" ON "PaperAttempt"("sessionId");

-- CreateIndex
CREATE INDEX "PaperExamSession_userId_startedAt_idx" ON "PaperExamSession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "PaperQuestionReview_userId_dueDay_idx" ON "PaperQuestionReview"("userId", "dueDay");

-- CreateIndex
CREATE UNIQUE INDEX "GradeBoundary_unitCode_paperCode_year_series_key" ON "GradeBoundary"("unitCode", "paperCode", "year", "series");

-- CreateIndex
CREATE INDEX "AiCallLog_createdAt_idx" ON "AiCallLog"("createdAt");

-- CreateIndex
CREATE INDEX "AiCallLog_userId_createdAt_idx" ON "AiCallLog"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "PaperSitting" ADD CONSTRAINT "PaperSitting_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperSitting" ADD CONSTRAINT "PaperSitting_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "papers" ADD CONSTRAINT "papers_sittingId_fkey" FOREIGN KEY ("sittingId") REFERENCES "PaperSitting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperQuestion" ADD CONSTRAINT "PaperQuestion_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperQuestion" ADD CONSTRAINT "PaperQuestion_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PaperQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperQuestion" ADD CONSTRAINT "PaperQuestion_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPaper" ADD CONSTRAINT "UserPaper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPaper" ADD CONSTRAINT "UserPaper_sittingId_fkey" FOREIGN KEY ("sittingId") REFERENCES "PaperSitting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperAttempt" ADD CONSTRAINT "PaperAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperAttempt" ADD CONSTRAINT "PaperAttempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PaperQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperAttempt" ADD CONSTRAINT "PaperAttempt_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PaperExamSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperExamSession" ADD CONSTRAINT "PaperExamSession_sittingId_fkey" FOREIGN KEY ("sittingId") REFERENCES "PaperSitting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperQuestionReview" ADD CONSTRAINT "PaperQuestionReview_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PaperQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
