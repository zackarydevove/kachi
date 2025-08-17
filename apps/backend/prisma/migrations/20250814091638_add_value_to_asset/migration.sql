/*
  Warnings:

  - You are about to drop the column `quantity` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Asset` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Asset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AssetTypeEnum" AS ENUM ('networth', 'crypto', 'realEstate', 'stock', 'cash', 'exotic');

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_userId_fkey";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "quantity",
DROP COLUMN "unitPrice",
DROP COLUMN "userId",
DROP COLUMN "value",
DROP COLUMN "type",
ADD COLUMN     "type" "AssetTypeEnum" NOT NULL;

-- DropEnum
DROP TYPE "AssetType";

-- CreateTable
CREATE TABLE "AssetSnapshot" (
    "id" SERIAL NOT NULL,
    "assetId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetSnapshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssetSnapshot" ADD CONSTRAINT "AssetSnapshot_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
