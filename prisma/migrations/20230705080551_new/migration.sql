-- CreateTable
CREATE TABLE "SiteIndent" (
    "indentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "indentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project" TEXT NOT NULL,
    "store" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "gp" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "indentStatus" TEXT NOT NULL,
    "inventoryCategory" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteIndent_pkey" PRIMARY KEY ("indentId")
);
