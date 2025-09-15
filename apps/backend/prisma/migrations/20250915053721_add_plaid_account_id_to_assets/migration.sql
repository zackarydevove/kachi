/*
  Warnings:

  - A unique constraint covering the columns `[plaidAccountId]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "plaidAccountId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_plaidAccountId_key" ON "Asset"("plaidAccountId");
