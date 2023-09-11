/*
  Warnings:

  - You are about to drop the `StockItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "StockItem";

-- CreateTable
CREATE TABLE "ItemCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemSubCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemSubSubCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subsubcategory" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemSubSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemUnit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemProduct" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "subsubcategory" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemProduct_pkey" PRIMARY KEY ("id")
);
