-- CreateTable
CREATE TABLE "WorkOrder" (
    "workOrderId" TEXT NOT NULL,
    "vendorId" TEXT,
    "vendorName" TEXT,
    "name" TEXT,
    "address" TEXT,
    "workOrderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gstInNo" TEXT,
    "panNo" TEXT,
    "kindAttn" TEXT,
    "mobileNo" TEXT,
    "emailId" TEXT,
    "subject" TEXT,
    "quotationDate" TIMESTAMP(3),
    "tableData" JSONB,
    "scopeOfWork" TEXT,
    "priceBasis" TEXT,
    "taxesAndDuties" TEXT,
    "paymentTerms" TEXT,
    "workCompletionSchedule" TEXT,
    "keyMaterialsProcurement" TEXT,
    "inspections" TEXT,
    "defectLiabilityPeriod" TEXT,
    "safetyRequirement" TEXT,
    "statutoryRequirement" TEXT,
    "otherTermAndCondition" TEXT,
    "general" TEXT,
    "other" TEXT,
    "note" TEXT,
    "pdfOfWorkOrder" TEXT,
    "billingAddress" TEXT,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("workOrderId")
);
