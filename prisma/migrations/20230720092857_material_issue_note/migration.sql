-- CreateTable
CREATE TABLE "MaterialIssueNote" (
    "minId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "indentId" TEXT NOT NULL,
    "indentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT,
    "project" TEXT NOT NULL,
    "store" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "gp" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "indentStatus" TEXT NOT NULL,
    "tableData" JSONB,
    "itemName" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialIssueNote_pkey" PRIMARY KEY ("minId")
);
