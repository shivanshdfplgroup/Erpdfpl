/*
  Warnings:

  - You are about to drop the column `tableData` on the `Quotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "tableData",
ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "gst" TEXT,
ADD COLUMN     "gstAmount" DOUBLE PRECISION,
ADD COLUMN     "materialCategory" TEXT,
ADD COLUMN     "materialDescription" TEXT,
ADD COLUMN     "materialSubCategory" TEXT,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "rate" DOUBLE PRECISION,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "uom" TEXT;
