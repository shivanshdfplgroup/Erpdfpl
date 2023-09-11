/*
  Warnings:

  - You are about to drop the column `indentStatus` on the `MaterialIssueNote` table. All the data in the column will be lost.
  - You are about to drop the column `itemName` on the `MaterialIssueNote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MaterialIssueNote" DROP COLUMN "indentStatus",
DROP COLUMN "itemName";
