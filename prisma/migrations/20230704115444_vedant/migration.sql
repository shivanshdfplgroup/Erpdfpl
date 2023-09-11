/*
  Warnings:

  - You are about to drop the `ItemCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemSubSubCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ItemCategory";

-- DropTable
DROP TABLE "ItemSubCategory";

-- DropTable
DROP TABLE "ItemSubSubCategory";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subsubcategory" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subcategoryId" INTEGER NOT NULL,

    CONSTRAINT "Subsubcategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subsubcategory" ADD CONSTRAINT "Subsubcategory_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
