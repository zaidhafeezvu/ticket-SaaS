-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN "qrCode" TEXT;
ALTER TABLE "Purchase" ADD COLUMN "qrCodeScanned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Purchase" ADD COLUMN "qrCodeScannedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_qrCode_key" ON "Purchase"("qrCode");

-- CreateIndex
CREATE INDEX "Purchase_qrCode_idx" ON "Purchase"("qrCode");
