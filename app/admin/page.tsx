import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logout, setBookingStatus } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  confirmed: { label: "Terkonfirmasi", className: "bg-brand-50 text-brand-800 ring-brand-200" },
  completed: { label: "Selesai", className: "bg-cream text-ink ring-ink/10" },
  cancelled: { label: "Batal", className: "bg-red-50 text-red-700 ring-red-200" },
  no_show: { label: "No-show", className: "bg-ink/5 text-ink-soft ring-ink/10" },
};

const DAY_LABELS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function formatHeader(date: Date): string {
  return `${DAY_LABELS[date.getDay()]}, ${date.getDate()} ${date.toLocaleDateString("id-ID", { month: "long" })} ${date.getFullYear()}`;
}

const actionBtn =
  "rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition whitespace-nowrap";

export default async function AdminDashboard() {
  await requireAdmin();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const rangeStart = new Date(startOfToday);
  rangeStart.setDate(rangeStart.getDate() - 30);
  const rangeEnd = new Date(startOfToday);
  rangeEnd.setDate(rangeEnd.getDate() + 60);

  const bookings = await prisma.booking.findMany({
    where: { date: { gte: rangeStart, lt: rangeEnd } },
    orderBy: [{ date: "asc" }, { slotTime: "asc" }],
    include: { service: true },
  });

  const todayCount = bookings.filter(
    (b) => b.date.getTime() === startOfToday.getTime(),
  ).length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const byDate = new Map<string, typeof bookings>();
  for (const b of bookings) {
    const key = b.date.getTime() === startOfToday.getTime() ? "Hari Ini" : formatHeader(b.date);
    const list = byDate.get(key) ?? [];
    list.push(b);
    byDate.set(key, list);
  }
  // "Hari Ini" selalu paling atas, sisanya urut tanggal.
  const groups = [...byDate.entries()].sort(([a], [b]) =>
    a === "Hari Ini" ? -1 : b === "Hari Ini" ? 1 : 0,
  );

  return (
    <main className="min-h-dvh bg-cream pb-20">
      <header className="sticky top-0 z-10 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Dashboard</p>
            <p className="text-sm font-bold text-ink">Booking Klinik</p>
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href="/admin/export"
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink ring-1 ring-ink/10 transition hover:ring-brand-300"
            >
              Ekspor CSV
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full px-4 py-2 text-xs font-semibold text-ink-soft transition hover:text-ink"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pt-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Menunggu konfirmasi", value: pendingCount, hint: "booking berstatus pending" },
            { label: "Hari ini", value: todayCount, hint: "booking kunjungan hari ini" },
            { label: "Total booking", value: bookings.length, hint: "rentang 30 hari lalu – 60 hari ke depan" },
          ].map((s) => (
            <div key={s.label} className="rounded-3xl bg-white p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{s.label}</p>
              <p className="tabular mt-1.5 text-3xl font-extrabold text-ink">{s.value}</p>
              <p className="text-xs text-ink-soft">{s.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-6">
          {groups.map(([label, list]) => (
            <section key={label} className="overflow-hidden rounded-3xl bg-white shadow-card">
              <h2 className="border-b border-ink/5 px-6 py-4 text-sm font-bold text-ink">
                {label}
                <span className="tabular ml-2 font-normal text-ink-soft">{list.length} booking</span>
              </h2>
              <ul className="divide-y divide-ink/5">
                {list.map((b) => {
                  const meta = STATUS_META[b.status] ?? STATUS_META.pending;
                  return (
                    <li key={b.id} className="flex flex-wrap items-center gap-x-5 gap-y-2 px-6 py-4">
                      <span className="tabular w-14 text-sm font-bold text-ink">{b.slotTime}</span>
                      <div className="min-w-[14rem] flex-1">
                        <p className="text-sm font-semibold text-ink">
                          {b.name}
                          <span className="ml-2 font-normal text-ink-soft">{b.phone}</span>
                        </p>
                        <p className="text-xs text-ink-soft">
                          {b.service.name} · {b.code}
                          {b.notes ? ` · ${b.notes}` : ""}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${meta.className}`}
                      >
                        {meta.label}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {b.status === "pending" && (
                          <form action={setBookingStatus}>
                            <input type="hidden" name="code" value={b.code} />
                            <input type="hidden" name="status" value="confirmed" />
                            <button type="submit" className={`${actionBtn} bg-brand-600 text-white ring-brand-600 hover:bg-brand-700`}>
                              Konfirmasi
                            </button>
                          </form>
                        )}
                        {b.status === "confirmed" && (
                          <>
                            <form action={setBookingStatus}>
                              <input type="hidden" name="code" value={b.code} />
                              <input type="hidden" name="status" value="completed" />
                              <button type="submit" className={`${actionBtn} bg-white text-brand-700 ring-brand-200 hover:bg-brand-50`}>
                                Tuntas
                              </button>
                            </form>
                            <form action={setBookingStatus}>
                              <input type="hidden" name="code" value={b.code} />
                              <input type="hidden" name="status" value="no_show" />
                              <button type="submit" className={`${actionBtn} bg-white text-ink-soft ring-ink/10 hover:text-ink`}>
                                No-show
                              </button>
                            </form>
                          </>
                        )}
                        {(b.status === "pending" || b.status === "confirmed") && (
                          <form action={setBookingStatus}>
                            <input type="hidden" name="code" value={b.code} />
                            <input type="hidden" name="status" value="cancelled" />
                            <button type="submit" className={`${actionBtn} bg-white text-red-600 ring-red-200 hover:bg-red-50`}>
                              Batalkan
                            </button>
                          </form>
                        )}
                        <Link
                          href={`/booking/${b.code}`}
                          className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink-soft underline decoration-ink/15 underline-offset-4 hover:text-ink"
                        >
                          Detail
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          {bookings.length === 0 && (
            <p className="rounded-3xl bg-white p-8 text-center text-sm text-ink-soft shadow-card">
              Belum ada booking dalam rentang ini.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
