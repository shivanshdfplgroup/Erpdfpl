/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Subcategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Subsubcategory` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Subsubcategory" DROP CONSTRAINT "Subsubcategory_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Subcategory_id_seq";

-- AlterTable
ALTER TABLE "Subsubcategory" DROP CONSTRAINT "Subsubcategory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "subcategoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Subsubcategory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Subsubcategory_id_seq";

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subsubcategory" ADD CONSTRAINT "Subsubcategory_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
