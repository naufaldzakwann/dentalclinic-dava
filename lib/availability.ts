import { prisma } from "./db";
import type { ClinicLocationId } from "./site";

export const SLOT_MINUTES = 30;
export const LEAD_MINUTES = 60; // jeda minimum dari sekarang untuk booking hari ini

export type AvailabilityResult =
  | { ok: true; slots: string[] }
  | { ok: false; reason: "invalid" | "closed" | "past" };

/** Parse "YYYY-MM-DD" → Date tengah malam lokal; null bila format/tanggal tidak valid. */
export function parseDateParam(raw: string | null | undefined): Date | null {
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const [y, m, d] = raw.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  // cegah rollover (mis. 2026-02-31 menjadi 3 Mar)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

/** "YYYY-MM-DD" dari sebuah Date, berdasarkan waktu lokal. */
export function toDateParam(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const toMinutes = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const formatMinutes = (min: number): string =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/**
 * Slot mulai yang tersedia untuk satu tanggal & layanan.
 * Aturan: jam praktik hari itu − break − tanggal libur − slot terisi (interval durasi layanan)
 * − waktu yang sudah lewat (hanya untuk hari ini, dengan jeda LEAD_MINUTES).
 */
export async function getAvailableSlots(
  date: Date,
  serviceSlug: string,
  clinicLocation: ClinicLocationId,
): Promise<AvailabilityResult> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (date < startOfToday) return { ok: false, reason: "past" };

  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
  if (!service || !service.isActive) return { ok: false, reason: "invalid" };

  const blocked = await prisma.blockedDate.findUnique({ where: { date } });
  if (blocked) return { ok: false, reason: "closed" };

  const hours = await prisma.operatingHour.findMany({ where: { dayOfWeek: date.getDay() } });
  const open = hours.find((h) => h.dentistId !== null) ?? hours[0];
  if (!open) return { ok: false, reason: "closed" };

  const taken = await prisma.booking.findMany({
    where: { date, clinicLocation, status: { not: "cancelled" } },
    select: { slotTime: true, service: { select: { duration: true } } },
  });
  const occupied = taken.map((b) => {
    const start = toMinutes(b.slotTime);
    return [start, start + b.service.duration] as const;
  });

  const isToday = date.getTime() === startOfToday.getTime();
  const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + LEAD_MINUTES : 0;
  const openMin = toMinutes(open.openTime);
  const closeMin = toMinutes(open.closeTime);
  const breakFrom = open.breakFrom ? toMinutes(open.breakFrom) : null;
  const breakTo = open.breakTo ? toMinutes(open.breakTo) : null;

  const slots: string[] = [];
  for (let start = openMin; start + service.duration <= closeMin; start += SLOT_MINUTES) {
    if (start < earliest) continue;
    if (breakFrom !== null && breakTo !== null && start < breakTo && start + service.duration > breakFrom) continue;
    const end = start + service.duration;
    if (occupied.some(([os, oe]) => start < oe && os < end)) continue;
    slots.push(formatMinutes(start));
  }
  return { ok: true, slots };
}
