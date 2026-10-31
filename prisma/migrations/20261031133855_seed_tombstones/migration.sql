-- CreateTable
CREATE TABLE "SeedTombstone" (
    "seedKey" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeedTombstone_pkey" PRIMARY KEY ("seedKey")
);
