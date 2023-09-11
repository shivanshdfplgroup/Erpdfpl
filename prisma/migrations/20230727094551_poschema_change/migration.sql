/*
  Warnings:

  - You are about to drop the `PO` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PO";

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "poId" TEXT NOT NULL,
    "projectName" TEXT,
    "projectId" TEXT,
    "poDate" TEXT,
    "msName" TEXT,
    "msAddress" TEXT,
    "msGst" TEXT,
    "contactPersonName" TEXT,
    "contactPersonMobile" TEXT,
    "contactPersonEmail" TEXT,
    "povalidity" TEXT,
    "orderStatus" TEXT,
    "subjectOfPo" TEXT,
    "referrenceSite" TEXT,
    "tableData" JSONB,
    "changedBillingAddress" TEXT,
    "deliveryAddress" TEXT,
    "secondaryDeliveryAddress" TEXT,
    "deliveryTerms" TEXT,
    "deliveryTime" TEXT,
    "paymentTerms" TEXT,
    "tpiStatus" TEXT,
    "contactAtHeadOffice" TEXT,
    "otherTermsInDPR" TEXT,
    "documentS3Key" TEXT,
    "poStatus" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("poId")
);
