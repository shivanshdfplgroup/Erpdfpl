/*
  Warnings:

  - A unique constraint covering the columns `[category]` on the table `ItemCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subcategory]` on the table `ItemSubCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subsubcategory]` on the table `ItemSubSubCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ItemCategory_category_key" ON "ItemCategory"("category");

-- CreateIndex
CREATE UNIQUE INDEX "ItemSubCategory_subcategory_key" ON "ItemSubCategory"("subcategory");

-- CreateIndex
CREATE UNIQUE INDEX "ItemSubSubCategory_subsubcategory_key" ON "ItemSubSubCategory"("subsubcategory");
