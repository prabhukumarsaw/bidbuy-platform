/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_createdBy_fkey";

-- DropIndex
DROP INDEX "Category_createdBy_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "createdBy",
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
