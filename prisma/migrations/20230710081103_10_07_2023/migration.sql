/*
  Warnings:

  - The `grDocumentFileKey` column on the `MRN` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MRN" DROP COLUMN "grDocumentFileKey",
ADD COLUMN     "grDocumentFileKey" TEXT[];

-- CreateTable
CREATE TABLE "BOQ" (
    "boqId" SERIAL NOT NULL,
    "boqDistrict" TEXT NOT NULL,
    "boqNameOfGp" TEXT NOT NULL,

    CONSTRAINT "BOQ_pkey" PRIMARY KEY ("boqId")
);
