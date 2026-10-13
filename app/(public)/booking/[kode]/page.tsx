import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { clinicLocations, site } from "@/lib/site";
import { cancelOwnBooking } from "./actions";
import { T } from "@/components/SitePreferences";
import LocalizedDate from "@/components/LocalizedDate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Status Booking",
  robots: { index: false },
};

const STATUS_META: Record<string, { label: string; labelId: string; className: string; desc: string; descId: string }> = {
  pending: {
    label: "Menunggu konfirmasi", labelId: "status.pending", className: "bg-accent-100 text-accent-600 ring-accent-200",
    desc: "Staf klinik akan mengonfirmasi jadwal Anda lewat WhatsApp. Mohon ditunggu ya.", descId: "status.pendingDesc",
  },
  confirmed: {
    label: "Terkonfirmasi", labelId: "status.confirmed", className: "bg-brand-50 text-brand-800 ring-brand-200",
    desc: "Janji temu Anda sudah dikonfirmasi. Datang 10 menit lebih awal, ya!", descId: "status.confirmedDesc",
  },
  completed: {
    label: "Selesai", labelId: "status.completed", className: "bg-cream text-ink ring-ink/10",
    desc: "Perawatan sudah dilakukan. Terima kasih sudah datang — jangan lupa kontrol berikutnya.", descId: "status.completedDesc",
  },
  cancelled: {
    label: "Dibatalkan", labelId: "status.cancelled", className: "bg-red-50 text-red-700 ring-red-200",
    desc: "Booking ini dibatalkan. Ingin datang? Silakan buat booking baru.", descId: "status.cancelledDesc",
  },
  no_show: {
    label: "Tidak hadir", labelId: "status.no_show", className: "bg-cream text-ink-soft ring-ink/10",
    desc: "Anda tidak hadir pada jadwal ini. Bila masih ingin perawatan, buat booking baru.", descId: "status.noShowDesc",
  },
};

export default async function BookingStatusPage({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  const booking = await prisma.booking.findUnique({
    where: { code: decodeURIComponent(kode).toUpperCase() },
    include: { service: true },
  });
  if (!booking) notFound();

  const status = STATUS_META[booking.status] ?? STATUS_META.pending;
  const clinic = clinicLocations.find((item) => item.id === booking.clinicLocation) ?? clinicLocations[0];
  const canCancel = booking.status === "pending" || booking.status === "confirmed";
  const waReschedule = encodeURIComponent(
    `Halo, saya ingin mengubah jadwal booking ${booking.code} di Klinik ${clinic.city} (nama: ${booking.name}).`,
  );
  const rows: Array<{ id: string; label: string; value: ReactNode }> = [
    { id: "status.service", label: "Layanan", value: <T id={`service.${booking.service.slug}.name`} fallback={booking.service.name} /> },
    { id: "status.location", label: "Lokasi klinik", value: clinic.city },
    { id: "status.date", label: "Tanggal", value: <LocalizedDate value={booking.date.toISOString()} /> },
    { id: "status.time", label: "Jam", value: `${booking.slotTime} WIB` },
    { id: "status.name", label: "Nama", value: booking.name },
    { id: "status.whatsapp", label: "WhatsApp", value: booking.phone },
    ...(booking.email ? [{ id: "status.email", label: "Email", value: booking.email }] : []),
    ...(booking.notes ? [{ id: "status.concern", label: "Keluhan", value: booking.notes }] : []),
  ];

  return (
    <section className="mx-auto max-w-2xl px-5 py-16 sm:py-20">
      <div className="rounded-[1.75rem] bg-white p-7 shadow-card sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700"><T id="status.title" fallback="Status Booking" /></p>
          <span className={`rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 ${status.className}`}>
            <T id={status.labelId} fallback={status.label} />
          </span>
        </div>

        <p className="tabular mt-5 text-3xl font-extrabold tracking-wide text-ink sm:text-4xl">{booking.code}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft"><T id={status.descId} fallback={status.desc} /></p>

        <dl className="mt-7 divide-y divide-ink/8 border-y border-ink/8 text-sm">
          {rows.map((row) => (
            <div key={row.id} className="flex justify-between gap-6 py-3">
              <dt className="shrink-0 text-ink-soft"><T id={row.id} fallback={row.label} /></dt>
              <dd className="text-right font-semibold text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {canCancel && (
            <form action={cancelOwnBooking}>
              <input type="hidden" name="code" value={booking.code} />
              <button type="submit" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50">
                <T id="status.cancelBooking" fallback="Batalkan Booking" />
              </button>
            </form>
          )}
          {canCancel && (
            <a href={`https://wa.me/${site.whatsapp}?text=${waReschedule}`} className="text-sm font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-800">
              <T id="status.reschedule" fallback="Ubah jadwal via WhatsApp" />
            </a>
          )}
          {!canCancel && (
            <Link href="/booking" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700">
              <T id="status.newBooking" fallback="Buat Booking Baru" />
            </Link>
          )}
          <Link href="/" className="text-sm font-semibold text-ink-soft underline decoration-ink/20 underline-offset-4 hover:text-ink">
            <T id="status.home" fallback="Kembali ke beranda" />
          </Link>
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-ink-soft"><T id="status.saveLink" fallback="Simpan tautan halaman ini — status booking selalu yang terbaru." /></p>
    </section>
  );
}
