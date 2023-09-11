/*
  Warnings:

  - Added the required column `userId` to the `MTO` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MTO" ADD COLUMN     "userId" TEXT NOT NULL;
