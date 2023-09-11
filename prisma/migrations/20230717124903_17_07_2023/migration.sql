/*
  Warnings:

  - You are about to drop the column `desc` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `materialCode` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "desc",
DROP COLUMN "materialCode",
ADD COLUMN     "materialCategory" TEXT,
ADD COLUMN     "materialDesc" TEXT,
ADD COLUMN     "materialSubCategory" TEXT;
