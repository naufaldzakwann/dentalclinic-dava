ALTER TABLE "Booking" ADD COLUMN "clinicLocation" TEXT NOT NULL DEFAULT 'pekanbaru';

UPDATE "Booking"
SET "slotKey" = 'pekanbaru|' || "slotKey"
WHERE "slotKey" IS NOT NULL;

CREATE INDEX "Booking_clinicLocation_date_idx" ON "Booking"("clinicLocation", "date");
