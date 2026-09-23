import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots, parseDateParam } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const date = parseDateParam(req.nextUrl.searchParams.get("date"));
  const serviceSlug = req.nextUrl.searchParams.get("serviceId");

  if (!date || !serviceSlug) {
    return NextResponse.json({ error: "Parameter date & serviceId wajib diisi." }, { status: 400 });
  }

  const result = await getAvailableSlots(date, serviceSlug);
  return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
}
