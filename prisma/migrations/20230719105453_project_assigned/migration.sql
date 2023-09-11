/*
  Warnings:

  - You are about to drop the column `projectRoleObject` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "projectRoleObject",
ADD COLUMN     "projectsAssigned" TEXT[];
