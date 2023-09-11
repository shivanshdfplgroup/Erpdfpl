/*
  Warnings:

  - Added the required column `updatedAt` to the `BOM` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MRN` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MTO` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BOM" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MRN" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MTO" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Vendors" ADD COLUMN     "details" TEXT;

-- AlterTable
ALTER TABLE "toDoList" ADD COLUMN     "projectId" TEXT;

-- CreateTable
CREATE TABLE "PO" (
    "poId" TEXT NOT NULL,
    "projectName" TEXT,
    "projectDate" TEXT,
    "msName" TEXT NOT NULL,
    "msAddress" TEXT NOT NULL,
    "msGst" TEXT NOT NULL,
    "contactPersonName" TEXT NOT NULL,
    "contactPersonMobile" TEXT NOT NULL,
    "contactPersonEmail" TEXT NOT NULL,
    "orderStatus" TEXT NOT NULL,
    "subjectOfPo" TEXT NOT NULL,
    "referrenceSite" TEXT NOT NULL,
    "negotiationTableData" TEXT,
    "otherTermsAndConditions" TEXT NOT NULL,
    "changedBillingAddress" TEXT,
    "deliveryAddress" TEXT,
    "secondaryDeliveryAddress" TEXT,
    "deliveryTerms" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "paymentTerms" TEXT NOT NULL,
    "tpiStatus" TEXT NOT NULL,
    "contactAtHeadOffice" TEXT NOT NULL,
    "otherTermsInDPR" TEXT NOT NULL,
    "documentS3Key" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PO_pkey" PRIMARY KEY ("poId")
);
