-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPROVED', 'REQUESTED', 'EXPIRED', 'SUSPEND', 'ONLINE');

-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('TRUCK', 'PUSH_CART');

-- CreateTable
CREATE TABLE "FoodTrucks" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "applicant" TEXT NOT NULL,
    "facilityType" "FacilityType" NOT NULL,
    "cnn" INTEGER NOT NULL,
    "locationDescription" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "blocklot" INTEGER NOT NULL,
    "block" INTEGER NOT NULL,
    "lot" INTEGER NOT NULL,
    "permit" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "foodItems" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "openDays" JSONB NOT NULL,
    "openTime" JSONB NOT NULL,
    "approved_at" TIMESTAMP(3) NOT NULL,
    "received" TIMESTAMP(3) NOT NULL,
    "priorPermit" INTEGER NOT NULL,
    "expirationAt" TIMESTAMP(3) NOT NULL,
    "firePreventionDistricts" INTEGER NOT NULL,
    "policeDistricts" INTEGER NOT NULL,
    "supervisorDistricts" INTEGER NOT NULL,
    "zipCodes" INTEGER NOT NULL,
    "oldNeighborhoods" INTEGER NOT NULL,

    CONSTRAINT "FoodTrucks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodTrucks_locationId_key" ON "FoodTrucks"("locationId");
