/*
  Warnings:

  - Added the required column `posted_by_user_id` to the `arrear_entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "arrear_entries" ADD COLUMN     "posted_by_user_id" UUID NOT NULL;
