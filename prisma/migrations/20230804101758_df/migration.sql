/*
  Warnings:

  - You are about to drop the column `selectedVendorsId` on the `ComparisionOfQuotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ComparisionOfQuotation" DROP COLUMN "selectedVendorsId",
ADD COLUMN     "selectedVendorsIds" TEXT[];
