/*
  Warnings:

  - You are about to drop the column `amount` on the `MRN` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `MRN` table. All the data in the column will be lost.
  - The primary key for the `returnSiteToStoreFormData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amount` on the `returnSiteToStoreFormData` table. All the data in the column will be lost.
  - You are about to drop the column `balanceMrn` on the `returnSiteToStoreFormData` table. All the data in the column will be lost.
  - You are about to drop the column `mrnDate` on the `returnSiteToStoreFormData` table. All the data in the column will be lost.
  - You are about to drop the column `mrnId` on the `returnSiteToStoreFormData` table. All the data in the column will be lost.
  - You are about to drop the column `mrnNumber` on the `returnSiteToStoreFormData` table. All the data in the column will be lost.
  - You are about to drop the column `mrnQuantity` on the `returnSiteToStoreFormData` table. All the data in the column will be lost.
  - You are about to drop the column `uom` on the `returnSiteToStoreFormData` table. All the data in the column will be lost.
  - You are about to drop the `returnableIndent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mrnAmount` to the `MRN` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mrnRate` to the `MRN` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balanceReturnSiteToStore` to the `returnSiteToStoreFormData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnSiteToStoreAmount` to the `returnSiteToStoreFormData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnSiteToStoreDate` to the `returnSiteToStoreFormData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnSiteToStoreId` to the `returnSiteToStoreFormData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnSiteToStoreNumber` to the `returnSiteToStoreFormData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnSiteToStoreQuantity` to the `returnSiteToStoreFormData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnSiteToStoreUom` to the `returnSiteToStoreFormData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MRN" DROP COLUMN "amount",
DROP COLUMN "rate",
ADD COLUMN     "mrnAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mrnContractorName" TEXT,
ADD COLUMN     "mrnGpName" TEXT,
ADD COLUMN     "mrnRate" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "returnSiteToStoreFormData" DROP CONSTRAINT "returnSiteToStoreFormData_pkey",
DROP COLUMN "amount",
DROP COLUMN "balanceMrn",
DROP COLUMN "mrnDate",
DROP COLUMN "mrnId",
DROP COLUMN "mrnNumber",
DROP COLUMN "mrnQuantity",
DROP COLUMN "uom",
ADD COLUMN     "balanceReturnSiteToStore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "returnSiteToStoreAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "returnSiteToStoreContractorName" TEXT,
ADD COLUMN     "returnSiteToStoreDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "returnSiteToStoreGpName" TEXT,
ADD COLUMN     "returnSiteToStoreId" TEXT NOT NULL,
ADD COLUMN     "returnSiteToStoreNumber" TEXT NOT NULL,
ADD COLUMN     "returnSiteToStoreQuantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "returnSiteToStoreUom" TEXT NOT NULL,
ADD CONSTRAINT "returnSiteToStoreFormData_pkey" PRIMARY KEY ("returnSiteToStoreId");

-- DropTable
DROP TABLE "returnableIndent";

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
