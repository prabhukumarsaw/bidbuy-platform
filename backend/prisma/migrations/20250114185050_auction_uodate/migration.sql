/*
  Warnings:

  - You are about to drop the column `auctionState` on the `auctions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auctions" DROP COLUMN "auctionState",
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- DropEnum
DROP TYPE "AuctionState";
