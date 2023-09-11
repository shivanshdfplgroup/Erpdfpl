-- CreateTable
CREATE TABLE "WorkOrderScopeOfWork" (
    "scopeOfWorkId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderScopeOfWork_pkey" PRIMARY KEY ("scopeOfWorkId")
);

-- CreateTable
CREATE TABLE "WorkOrderPriceBasis" (
    "priceBasisId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderPriceBasis_pkey" PRIMARY KEY ("priceBasisId")
);

-- CreateTable
CREATE TABLE "WorkOrderTaxesAndDuties" (
    "taxesAndDutiesId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderTaxesAndDuties_pkey" PRIMARY KEY ("taxesAndDutiesId")
);

-- CreateTable
CREATE TABLE "WorkOrderPaymentTerms" (
    "paymentTermsId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderPaymentTerms_pkey" PRIMARY KEY ("paymentTermsId")
);

-- CreateTable
CREATE TABLE "WorkOrderWorkCompSchedule" (
    "workCompScheduleId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderWorkCompSchedule_pkey" PRIMARY KEY ("workCompScheduleId")
);

-- CreateTable
CREATE TABLE "WorkOrderKMP" (
    "kMPId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderKMP_pkey" PRIMARY KEY ("kMPId")
);

-- CreateTable
CREATE TABLE "WorkOrderInspections" (
    "inspectionsId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderInspections_pkey" PRIMARY KEY ("inspectionsId")
);

-- CreateTable
CREATE TABLE "WorkOrderDLP" (
    "dLPId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderDLP_pkey" PRIMARY KEY ("dLPId")
);

-- CreateTable
CREATE TABLE "WorkOrderSafetyRequirements" (
    "safetyRequirementsId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderSafetyRequirements_pkey" PRIMARY KEY ("safetyRequirementsId")
);

-- CreateTable
CREATE TABLE "WorkOrderStatutoryRequirements" (
    "statutoryRequirementsId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderStatutoryRequirements_pkey" PRIMARY KEY ("statutoryRequirementsId")
);

-- CreateTable
CREATE TABLE "WorkOrderOtherTAndC" (
    "otherTAndCId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderOtherTAndC_pkey" PRIMARY KEY ("otherTAndCId")
);

-- CreateTable
CREATE TABLE "WorkOrderGeneral" (
    "generalId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderGeneral_pkey" PRIMARY KEY ("generalId")
);

-- CreateTable
CREATE TABLE "WorkOrderOther" (
    "otherId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderOther_pkey" PRIMARY KEY ("otherId")
);

-- CreateTable
CREATE TABLE "WorkOrderNote" (
    "noteId" TEXT NOT NULL,
    "value" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderNote_pkey" PRIMARY KEY ("noteId")
);
