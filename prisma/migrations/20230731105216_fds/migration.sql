-- CreateTable
CREATE TABLE "WorkOrderTransportation" (
    "noteId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderTransportation_pkey" PRIMARY KEY ("noteId")
);
