"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { checkPassword, endAdminSession, requireAdmin, startAdminSession } from "@/lib/auth";
import { BOOKING_STATUSES } from "@/lib/booking";

export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) redirect("/admin/login?error=1");
  await startAdminSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endAdminSession();
  redirect("/admin/login");
}

/** Ubah status booking (konfirmasi / tuntas / batal / no-show) — hanya admin. */
export async function setBookingStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const code = String(formData.get("code") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!(BOOKING_STATUSES as readonly string[]).includes(status)) return;
  try {
    // Pembatalan melepas slot (slotKey null) agar jam itu bisa dibooking ulang.
    await prisma.booking.update({
      where: { code },
      data: status === "cancelled" ? { status, slotKey: null } : { status },
    });
  } catch {
    return; // booking sudah dihapus/berubah — biarkan UI memuat ulang
  }
  revalidatePath("/admin");
  revalidatePath(`/booking/${code}`);
}
