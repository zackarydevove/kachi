/*
  Warnings:

  - A unique constraint covering the columns `[accountId,date,assetId,type]` on the table `AssetSnapshot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `AssetSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssetSnapshot" DROP CONSTRAINT "AssetSnapshot_assetId_fkey";

-- AlterTable
ALTER TABLE "AssetSnapshot" ADD COLUMN     "accountId" INTEGER NOT NULL,
ADD COLUMN     "type" "AssetTypeEnum",
ALTER COLUMN "assetId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AssetSnapshot_accountId_date_assetId_type_key" ON "AssetSnapshot"("accountId", "date", "assetId", "type");

-- AddForeignKey
ALTER TABLE "AssetSnapshot" ADD CONSTRAINT "AssetSnapshot_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
