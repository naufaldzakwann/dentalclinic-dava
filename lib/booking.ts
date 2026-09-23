import { z } from "zod";
import { parseDateParam, getAvailableSlots } from "./availability";
import { prisma } from "./db";

export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const bookingInputSchema = z.object({
  serviceSlug: z.string().min(1).max(64),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(/^(\+62|62|0)8\d{7,12}$/, "Nomor WhatsApp tidak valid")),
  email: z.union([z.string().trim().email().max(120), z.literal("")]).optional(),
  notes: z.string().trim().max(500).optional(),
  consent: z.literal(true, { message: "Persetujuan pemrosesan data wajib dicentang" }),
  website: z.string().optional(), // honeypot — harus kosong
});
export type BookingInput = z.infer<typeof bookingInputSchema>;

export type CreateBookingResult =
  | { ok: true; code: string }
  | { ok: false; error: "invalid" | "unavailable" | "conflict" };

/** Format kode: DFA-YYMMDD-0001 (urut per tanggal kunjungan). */
function bookingCode(date: Date, seq: number): string {
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `DFA-${y}${m}${d}-${String(seq).padStart(4, "0")}`;
}

/** Kunci slot aktif — mencegah slot kembar di level DB. */
export function slotKeyFor(dentistId: string | null, date: Date, slotTime: string): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${dentistId ?? "-"}|${y}${m}${d}|${slotTime}`;
}

/**
 * Buat booking: validasi ulang slot terhadap availability terkini, lalu simpan.
 * Konflik slot/kode dicegah constraint unik di DB; konflik kode dicoba ulang,
 * konflik slot (seseorang lebih dulu) langsung dilaporkan.
 */
export async function createBooking(input: BookingInput): Promise<CreateBookingResult> {
  const date = parseDateParam(input.date);
  if (!date) return { ok: false, error: "invalid" };

  const service = await prisma.service.findUnique({ where: { slug: input.serviceSlug } });
  if (!service || !service.isActive) return { ok: false, error: "invalid" };

  const availability = await getAvailableSlots(date, input.serviceSlug);
  if (!availability.ok || !availability.slots.includes(input.slotTime)) {
    return { ok: false, error: "unavailable" };
  }

  const dentist = await prisma.dentist.findFirst();
  const key = slotKeyFor(dentist?.id ?? null, date, input.slotTime);
  const count = await prisma.booking.count({ where: { date } });

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = bookingCode(date, count + 1 + attempt);
    try {
      await prisma.booking.create({
        data: {
          code,
          name: input.name,
          phone: input.phone,
          email: input.email || null,
          serviceId: service.id,
          dentistId: dentist?.id ?? null,
          date,
          slotTime: input.slotTime,
          slotKey: key,
          notes: input.notes || null,
        },
      });
      return { ok: true, code };
    } catch (error) {
      const prismaError = error as { code?: string; meta?: { target?: string[] } };
      if (prismaError.code === "P2002") {
        // slotKey tabrakan = slot benar-benar diambil; konflik kode = coba urutan berikut
        if (prismaError.meta?.target?.includes("slotKey")) return { ok: false, error: "conflict" };
        continue;
      }
      throw error;
    }
  }
  return { ok: false, error: "conflict" };
}
