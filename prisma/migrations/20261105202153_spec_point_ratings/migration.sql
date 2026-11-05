-- CreateEnum
CREATE TYPE "Confidence" AS ENUM ('RED', 'AMBER', 'GREEN');

-- CreateTable
CREATE TABLE "SpecPointRating" (
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "rating" "Confidence" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecPointRating_pkey" PRIMARY KEY ("userId","topicId","point")
);

-- AddForeignKey
ALTER TABLE "SpecPointRating" ADD CONSTRAINT "SpecPointRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecPointRating" ADD CONSTRAINT "SpecPointRating_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
