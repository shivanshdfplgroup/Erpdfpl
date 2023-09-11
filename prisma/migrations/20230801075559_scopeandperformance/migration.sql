-- AlterTable
ALTER TABLE "WorkOrderScopeOfWork" ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "WorkOrderPerformanceAndTermination" (
    "performanceId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderPerformanceAndTermination_pkey" PRIMARY KEY ("performanceId")
);
