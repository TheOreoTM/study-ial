-- CreateTable
CREATE TABLE "TutorExplanation" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TutorExplanation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TutorExplanation_kind_refId_point_key" ON "TutorExplanation"("kind", "refId", "point");
