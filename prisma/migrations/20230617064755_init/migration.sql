-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "projectName" TEXT,
    "companyName" TEXT,
    "serialNo" INTEGER,
    "directoryNo" TEXT,
    "recievedDate" TEXT,
    "materialCode" TEXT,
    "desc" TEXT,
    "units" INTEGER,
    "dispatchedQty" INTEGER,
    "recdQty" INTEGER,
    "vendorName" TEXT,
    "vendorID" TEXT,
    "vendorAddress" TEXT,
    "transportName" TEXT,
    "AWB_no" TEXT,
    "AWB_DT" TEXT,
    "eway_bill_no" TEXT,
    "vendorInvoiceNo" TEXT,
    "commInvoiceNo" TEXT,
    "date" TEXT,
    "status" TEXT,
    "vehicleNo" TEXT,
    "vehicleReleasedAtSite" TEXT,
    "vehicleReleasedFromSite" TEXT,
    "storage" TEXT,
    "ownedGP" TEXT,
    "transferredGP" TEXT[],
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assignedTo" TEXT[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "categories" TEXT[],
    "gstNo" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "invoices" TEXT[],
    "folderName" TEXT NOT NULL,

    CONSTRAINT "Vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "Role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
