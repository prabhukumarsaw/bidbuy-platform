-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SELLER';

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "gstNumber" TEXT,
    "gstDocument" TEXT,
    "aadhaarNumber" TEXT,
    "aadhaarDocument" TEXT,
    "panNumber" TEXT,
    "panDocument" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_userId_key" ON "Seller"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_gstNumber_key" ON "Seller"("gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_aadhaarNumber_key" ON "Seller"("aadhaarNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_panNumber_key" ON "Seller"("panNumber");

-- CreateIndex
CREATE INDEX "Seller_userId_idx" ON "Seller"("userId");

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
