import { NextRequest, NextResponse } from "next/server";
import { bookingInputSchema, createBooking } from "@/lib/booking";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Body harus berupa JSON yang valid." }, { status: 400 });
  }

  const parsed = bookingInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid." },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // Honeypot: bot yang mengisi field tersembunyi mendapat respons sukses palsu.
  if (input.website) return NextResponse.json({ ok: true, code: null }, { status: 201 });

  if (!rateLimit(`phone:${input.phone}`)) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan dari nomor ini. Coba lagi dalam satu jam." },
      { status: 429 },
    );
  }

  const result = await createBooking(input);
  if (!result.ok) {
    const message =
      result.error === "unavailable"
        ? "Slot itu baru saja terisi atau tidak tersedia. Silakan pilih jam lain."
        : result.error === "conflict"
          ? "Slot baru saja diambil orang lain saat Anda mengirim. Silakan coba pilih jam lain."
          : "Data booking tidak valid.";
    return NextResponse.json({ error: message }, { status: result.error === "invalid" ? 400 : 409 });
  }

  return NextResponse.json({ ok: true, code: result.code }, { status: 201 });
}
