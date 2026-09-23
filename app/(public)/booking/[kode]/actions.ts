"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

/** Pasien membatalkan sendiri bookingnya (hanya saat masih pending/confirmed). */
export async function cancelOwnBooking(formData: FormData): Promise<void> {
  const code = String(formData.get("code") ?? "").toUpperCase();
  const booking = await prisma.booking.findUnique({ where: { code } });
  if (booking && (booking.status === "pending" || booking.status === "confirmed")) {
    await prisma.booking.update({ where: { code }, data: { status: "cancelled", slotKey: null } });
    revalidatePath(`/booking/${code}`);
  }
}
