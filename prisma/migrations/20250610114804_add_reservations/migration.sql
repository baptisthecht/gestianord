/*
  Warnings:

  - You are about to drop the column `friday` on the `ParkingSpot` table. All the data in the column will be lost.
  - You are about to drop the column `monday` on the `ParkingSpot` table. All the data in the column will be lost.
  - You are about to drop the column `thursday` on the `ParkingSpot` table. All the data in the column will be lost.
  - You are about to drop the column `tuesday` on the `ParkingSpot` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ParkingSpot` table. All the data in the column will be lost.
  - You are about to drop the column `wednesday` on the `ParkingSpot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[defaultUserId]` on the table `ParkingSpot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ParkingSpot" DROP CONSTRAINT "ParkingSpot_userId_fkey";

-- AlterTable
ALTER TABLE "ParkingSpot" DROP COLUMN "friday",
DROP COLUMN "monday",
DROP COLUMN "thursday",
DROP COLUMN "tuesday",
DROP COLUMN "userId",
DROP COLUMN "wednesday",
ADD COLUMN     "defaultUserId" TEXT;

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "isCancelled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reservation_date_idx" ON "Reservation"("date");

-- CreateIndex
CREATE INDEX "Reservation_userId_idx" ON "Reservation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_date_spotId_key" ON "Reservation"("date", "spotId");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingSpot_defaultUserId_key" ON "ParkingSpot"("defaultUserId");

-- AddForeignKey
ALTER TABLE "ParkingSpot" ADD CONSTRAINT "ParkingSpot_defaultUserId_fkey" FOREIGN KEY ("defaultUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "ParkingSpot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
