-- AlterTable
ALTER TABLE "PR" ALTER COLUMN "miNumber" DROP NOT NULL,
ALTER COLUMN "miDate" DROP NOT NULL,
ALTER COLUMN "clientName" DROP NOT NULL,
ALTER COLUMN "requestedDate" DROP NOT NULL,
ALTER COLUMN "employer" DROP NOT NULL,
ALTER COLUMN "remark" DROP NOT NULL;
