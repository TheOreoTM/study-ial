-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "seedKey" TEXT,
    "topicId" TEXT NOT NULL,
    "userId" TEXT,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "status" "QuestionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashcardReview" (
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "dueDay" DATE NOT NULL,
    "intervalDays" INTEGER NOT NULL,
    "ease" DOUBLE PRECISION NOT NULL,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "lapses" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlashcardReview_pkey" PRIMARY KEY ("userId","flashcardId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flashcard_seedKey_key" ON "Flashcard"("seedKey");

-- CreateIndex
CREATE INDEX "Flashcard_topicId_status_idx" ON "Flashcard"("topicId", "status");

-- CreateIndex
CREATE INDEX "Flashcard_userId_topicId_idx" ON "Flashcard"("userId", "topicId");

-- CreateIndex
CREATE INDEX "FlashcardReview_userId_dueDay_idx" ON "FlashcardReview"("userId", "dueDay");

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashcardReview" ADD CONSTRAINT "FlashcardReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashcardReview" ADD CONSTRAINT "FlashcardReview_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
