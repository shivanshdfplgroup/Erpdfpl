-- CreateTable
CREATE TABLE "ComparisionOfQuotation" (
    "id" TEXT NOT NULL,
    "comparisionId" TEXT,
    "prId" TEXT,
    "projectId" TEXT,
    "projectName" TEXT,
    "selectedVendorsId" TEXT,
    "remarks" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComparisionOfQuotation_pkey" PRIMARY KEY ("id")
);
