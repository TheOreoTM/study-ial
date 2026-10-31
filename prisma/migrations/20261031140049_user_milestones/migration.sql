-- CreateTable
CREATE TABLE "UserMilestone" (
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "detail" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seenAt" TIMESTAMP(3),

    CONSTRAINT "UserMilestone_pkey" PRIMARY KEY ("userId","key")
);

-- AddForeignKey
ALTER TABLE "UserMilestone" ADD CONSTRAINT "UserMilestone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
