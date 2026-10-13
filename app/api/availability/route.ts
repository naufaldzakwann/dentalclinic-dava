import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots, parseDateParam } from "@/lib/availability";
import { isClinicLocationId } from "@/lib/site";

export async function GET(req: NextRequest) {
  const date = parseDateParam(req.nextUrl.searchParams.get("date"));
  const serviceSlug = req.nextUrl.searchParams.get("serviceId");
  const clinicLocation = req.nextUrl.searchParams.get("clinicLocation");

  if (!date || !serviceSlug || !isClinicLocationId(clinicLocation)) {
    return NextResponse.json({ error: "Tanggal, layanan, dan lokasi klinik wajib diisi." }, { status: 400 });
  }

  const result = await getAvailableSlots(date, serviceSlug, clinicLocation);
  return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
}
