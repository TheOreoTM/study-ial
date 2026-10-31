-- AlterTable
ALTER TABLE "StudyPlan" ADD COLUMN     "clonedFromId" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "StudyPlan_isPublic_sharedAt_idx" ON "StudyPlan"("isPublic", "sharedAt");

-- AddForeignKey
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_clonedFromId_fkey" FOREIGN KEY ("clonedFromId") REFERENCES "StudyPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
