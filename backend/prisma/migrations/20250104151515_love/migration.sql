-- DropForeignKey
ALTER TABLE "auctions" DROP CONSTRAINT "auctions_sellerId_fkey";

-- DropIndex
DROP INDEX "auctions_sellerId_idx";

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;
