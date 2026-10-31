/*
  Warnings:

  - Added the required column `introducedDay` to the `FlashcardReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FlashcardReview" ADD COLUMN     "introducedDay" DATE NOT NULL;
