/*
  Warnings:

  - Added the required column `poStatus` to the `PO` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PO" ADD COLUMN     "poStatus" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SiteIndent" ADD COLUMN     "table" JSONB[],
ADD COLUMN     "tableData" JSONB;
