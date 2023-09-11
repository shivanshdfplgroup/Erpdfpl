/*
  Warnings:

  - You are about to drop the column `companyName` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "companyName",
ADD COLUMN     "gpName" TEXT;
