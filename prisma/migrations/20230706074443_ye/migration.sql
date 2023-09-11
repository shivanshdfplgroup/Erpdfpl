/*
  Warnings:

  - You are about to drop the column `mrnAmount` on the `MRN` table. All the data in the column will be lost.
  - You are about to drop the column `mrnContractorName` on the `MRN` table. All the data in the column will be lost.
  - You are about to drop the column `mrnGpName` on the `MRN` table. All the data in the column will be lost.
  - You are about to drop the column `mrnRate` on the `MRN` table. All the data in the column will be lost.
  - You are about to drop the `returnSiteToStoreFormData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `returnableIndentData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `MRN` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `MRN` table without a default value. This is not possible if the table is not empty.
  - Made the column `remark` on table `SiteIndent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ItemProduct" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "MRN" DROP COLUMN "mrnAmount",
DROP COLUMN "mrnContractorName",
DROP COLUMN "mrnGpName",
DROP COLUMN "mrnRate",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rate" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "SiteIndent" ALTER COLUMN "remark" SET NOT NULL;

-- DropTable
DROP TABLE "returnSiteToStoreFormData";

-- DropTable
DROP TABLE "returnableIndentData";

-- CreateTable
CREATE TABLE "PR" (
    "prId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectName" TEXT NOT NULL,
    "projectCode" TEXT NOT NULL,
    "miNumber" TEXT NOT NULL,
    "miDate" TEXT NOT NULL,
    "agreementNo" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "requestedDate" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "materialDesc" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "deliveryAdd" TEXT NOT NULL,
    "makePreference" TEXT NOT NULL,
    "qualityInstruction" TEXT NOT NULL,
    "inspectionInstruction" TEXT NOT NULL,
    "documents" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PR_pkey" PRIMARY KEY ("prId")
);
