-- CreateTable
CREATE TABLE "returnSiteToStoreFormData" (
    "mrnId" TEXT NOT NULL,
    "mrnNumber" TEXT NOT NULL,
    "mrnDate" TIMESTAMP(3) NOT NULL,
    "poNumber" TEXT NOT NULL,
    "materialMainGroup" TEXT NOT NULL,
    "materialSubGroup" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "uom" TEXT NOT NULL,
    "poQuantity" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "mrnQuantity" DOUBLE PRECISION NOT NULL,
    "balanceMrn" DOUBLE PRECISION NOT NULL,
    "vendorName" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "transporterName" TEXT NOT NULL,
    "grDocumentFileKey" TEXT,
    "grDate" TIMESTAMP(3) NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "ewayBillNumber" TEXT NOT NULL,
    "storageLocation" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "returnSiteToStoreFormData_pkey" PRIMARY KEY ("mrnId")
);

-- CreateTable
CREATE TABLE "returnableIndent" (
    "mrnId" TEXT NOT NULL,
    "mrnNumber" TEXT NOT NULL,
    "mrnDate" TIMESTAMP(3) NOT NULL,
    "poNumber" TEXT NOT NULL,
    "materialMainGroup" TEXT NOT NULL,
    "materialSubGroup" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "uom" TEXT NOT NULL,
    "poQuantity" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "mrnQuantity" DOUBLE PRECISION NOT NULL,
    "balanceMrn" DOUBLE PRECISION NOT NULL,
    "vendorName" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "transporterName" TEXT NOT NULL,
    "grDocumentFileKey" TEXT,
    "grDate" TIMESTAMP(3) NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "ewayBillNumber" TEXT NOT NULL,
    "storageLocation" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "returnableIndent_pkey" PRIMARY KEY ("mrnId")
);