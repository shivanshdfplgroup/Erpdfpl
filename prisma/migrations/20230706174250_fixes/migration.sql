/*
  Warnings:

  - You are about to drop the column `amount` on the `MRN` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `MRN` table. All the data in the column will be lost.
  - Added the required column `mrnAmount` to the `MRN` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mrnRate` to the `MRN` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MRN" DROP COLUMN "amount",
DROP COLUMN "rate",
ADD COLUMN     "mrnAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mrnContractorName" TEXT,
ADD COLUMN     "mrnGpName" TEXT,
ADD COLUMN     "mrnRate" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "returnSiteToStoreFormData" (
    "returnSiteToStoreId" TEXT NOT NULL,
    "returnSiteToStoreNumber" TEXT NOT NULL,
    "returnSiteToStoreDate" TIMESTAMP(3) NOT NULL,
    "poNumber" TEXT NOT NULL,
    "materialMainGroup" TEXT NOT NULL,
    "materialSubGroup" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "returnSiteToStoreUom" TEXT NOT NULL,
    "poQuantity" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "returnSiteToStoreAmount" DOUBLE PRECISION NOT NULL,
    "returnSiteToStoreQuantity" DOUBLE PRECISION NOT NULL,
    "balanceReturnSiteToStore" DOUBLE PRECISION NOT NULL,
    "vendorName" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "transporterName" TEXT NOT NULL,
    "grDocumentFileKey" TEXT,
    "grDate" TIMESTAMP(3) NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "ewayBillNumber" TEXT NOT NULL,
    "storageLocation" TEXT NOT NULL,
    "returnSiteToStoreContractorName" TEXT,
    "returnSiteToStoreGpName" TEXT,
    "remark" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "returnSiteToStoreFormData_pkey" PRIMARY KEY ("returnSiteToStoreId")
);

-- CreateTable
CREATE TABLE "returnableIndentData" (
    "returnableIndentId" TEXT NOT NULL,
    "returnableIndentNumber" TEXT NOT NULL,
    "returnableIndentDate" TIMESTAMP(3) NOT NULL,
    "poNumber" TEXT NOT NULL,
    "materialMainGroup" TEXT NOT NULL,
    "materialSubGroup" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "returnableIndentUom" TEXT NOT NULL,
    "poQuantity" DOUBLE PRECISION NOT NULL,
    "returnableIndentRate" DOUBLE PRECISION NOT NULL,
    "returnableIndentAmount" DOUBLE PRECISION NOT NULL,
    "returnableIndentQuantity" DOUBLE PRECISION NOT NULL,
    "balanceReturnableIndent" DOUBLE PRECISION NOT NULL,
    "vendorName" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "transporterName" TEXT NOT NULL,
    "grDocumentFileKey" TEXT,
    "grDate" TIMESTAMP(3) NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "ewayBillNumber" TEXT NOT NULL,
    "storageLocation" TEXT NOT NULL,
    "returnableIndentContractorName" TEXT,
    "returnableIndentGpName" TEXT,
    "remark" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "returnableIndentData_pkey" PRIMARY KEY ("returnableIndentId")
);
