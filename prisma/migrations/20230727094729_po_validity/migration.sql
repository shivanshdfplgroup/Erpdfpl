/*
  Warnings:

  - You are about to drop the column `povalidity` on the `PurchaseOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PurchaseOrder" DROP COLUMN "povalidity",
ADD COLUMN     "poValidity" TEXT;
