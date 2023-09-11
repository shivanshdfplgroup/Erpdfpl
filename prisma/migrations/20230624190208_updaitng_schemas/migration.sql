-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "projectRoleObject" JSONB;

-- CreateTable
CREATE TABLE "Documents" (
    "documentId" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "s3Key" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("documentId")
);

-- CreateTable
CREATE TABLE "toDoList" (
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskDescription" TEXT,
    "taskStatus" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toDoList_pkey" PRIMARY KEY ("taskId")
);
