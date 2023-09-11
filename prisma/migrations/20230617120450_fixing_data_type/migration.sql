/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Role` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Vendors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[mobile]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "Role",
ADD COLUMN     "role" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "mobile" DROP NOT NULL,
ALTER COLUMN "mobile" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Vendors" DROP CONSTRAINT "Vendors_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Vendors_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Vendors_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");
