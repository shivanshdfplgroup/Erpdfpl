-- CreateTable
CREATE TABLE "idGeneration" (
    "custom_id" SERIAL NOT NULL,
    "uniqueId" TEXT NOT NULL,

    CONSTRAINT "idGeneration_pkey" PRIMARY KEY ("custom_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "idGeneration_uniqueId_key" ON "idGeneration"("uniqueId");
