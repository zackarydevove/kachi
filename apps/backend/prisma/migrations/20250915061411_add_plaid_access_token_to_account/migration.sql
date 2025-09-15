/*
  Warnings:

  - You are about to drop the column `plaidAccessToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plaidAccessToken]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_plaidAccessToken_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "plaidAccessToken" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "plaidAccessToken";

-- CreateIndex
CREATE UNIQUE INDEX "Account_plaidAccessToken_key" ON "Account"("plaidAccessToken");
