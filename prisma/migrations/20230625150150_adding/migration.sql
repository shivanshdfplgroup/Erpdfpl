-- CreateTable
CREATE TABLE "MRN" (
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

    CONSTRAINT "MRN_pkey" PRIMARY KEY ("mrnId")
);

-- CreateTable
CREATE TABLE "MTO" (
    "mtoId" TEXT NOT NULL,
    "mtoNumber" TEXT NOT NULL,
    "mtoDate" TIMESTAMP(3) NOT NULL,
    "mtoDescription" TEXT NOT NULL,
    "mtoUom" TEXT NOT NULL,
    "mtoQuantity" DOUBLE PRECISION NOT NULL,
    "mtoRate" DOUBLE PRECISION NOT NULL,
    "mtoAmount" DOUBLE PRECISION NOT NULL,
    "mtoContractorName" TEXT NOT NULL,
    "mtoGpName" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MTO_pkey" PRIMARY KEY ("mtoId")
);

-- CreateTable
CREATE TABLE "BOM" (
    "bomId" TEXT NOT NULL,
    "materialName" TEXT NOT NULL,
    "materialDescription" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BOM_pkey" PRIMARY KEY ("bomId")
);
