import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

function csvCell(value: string | number | null): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

/** Ekspor semua booking sebagai CSV (untuk laporan/pembukuan). */
export async function GET(): Promise<Response> {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  const bookings = await prisma.booking.findMany({
    orderBy: [{ date: "desc" }, { slotTime: "asc" }],
    include: { service: true, dentist: true },
  });

  const header = ["kode", "tanggal", "jam", "nama", "telepon", "email", "layanan", "status", "catatan", "dibuat"];
  const rows = bookings.map((b) =>
    [
      b.code,
      b.date.toISOString().slice(0, 10),
      b.slotTime,
      b.name,
      b.phone,
      b.email,
      b.service.name,
      b.status,
      b.notes,
      b.createdAt.toISOString().slice(0, 16).replace("T", " "),
    ]
      .map(csvCell)
      .join(","),
  );

  const csv = [header.join(","), ...rows].join("\n");
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response("\uFEFF" + csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="bookings-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
