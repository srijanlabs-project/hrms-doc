/*
  Warnings:

  - You are about to drop the column `originalRating` on the `calibration_cases` table. All the data in the column will be lost.
  - Added the required column `original_rating` to the `calibration_cases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "calibration_cases" DROP COLUMN "originalRating",
ADD COLUMN     "original_rating" INTEGER NOT NULL;
