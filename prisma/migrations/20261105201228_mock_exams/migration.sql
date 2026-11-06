-- CreateEnum
CREATE TYPE "MockStatus" AS ENUM ('IN_PROGRESS', 'MARKING', 'FINISHED');

-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN     "mockExamId" TEXT;

-- CreateTable
CREATE TABLE "MockExam" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "length" TEXT NOT NULL,
    "questionIds" TEXT[],
    "totalMarks" INTEGER NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "status" "MockStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "answers" JSONB NOT NULL DEFAULT '{}',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "marksAwarded" INTEGER,

    CONSTRAINT "MockExam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MockExam_userId_startedAt_idx" ON "MockExam"("userId", "startedAt");

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_mockExamId_fkey" FOREIGN KEY ("mockExamId") REFERENCES "MockExam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockExam" ADD CONSTRAINT "MockExam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockExam" ADD CONSTRAINT "MockExam_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
