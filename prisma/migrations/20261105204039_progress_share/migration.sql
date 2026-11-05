-- CreateTable
CREATE TABLE "ProgressShare" (
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastViewed" TIMESTAMP(3),

    CONSTRAINT "ProgressShare_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgressShare_tokenHash_key" ON "ProgressShare"("tokenHash");

-- AddForeignKey
ALTER TABLE "ProgressShare" ADD CONSTRAINT "ProgressShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
