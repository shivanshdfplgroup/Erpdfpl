/*
  Warnings:

  - You are about to drop the `WorkOrderTransportation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "WorkOrderTransportation";

-- CreateTable
CREATE TABLE "WorkOrderTransport" (
    "transportationId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderTransport_pkey" PRIMARY KEY ("transportationId")
);
