-- DropIndex
DROP INDEX "Booking_dentistId_date_slotTime_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "slotKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_slotKey_key" ON "Booking"("slotKey");

