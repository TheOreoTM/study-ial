-- CreateTable
CREATE TABLE "StudyPlanUnit" (
    "planId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyPlanUnit_pkey" PRIMARY KEY ("planId","unitId")
);

-- AddForeignKey
ALTER TABLE "StudyPlanUnit" ADD CONSTRAINT "StudyPlanUnit_planId_fkey" FOREIGN KEY ("planId") REFERENCES "StudyPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPlanUnit" ADD CONSTRAINT "StudyPlanUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
