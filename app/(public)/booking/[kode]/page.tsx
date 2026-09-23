import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";
import { cancelOwnBooking } from "./actions";
import { CheckIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Status Booking",
  robots: { index: false },
};

const STATUS_META: Record<string, { label: string; className: string; desc: string }> = {
  pending: {
    label: "Menunggu konfirmasi",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    desc: "Staf klinik akan mengonfirmasi jadwal Anda lewat WhatsApp. Mohon ditunggu ya.",
  },
  confirmed: {
    label: "Terkonfirmasi",
    className: "bg-brand-50 text-brand-800 ring-brand-200",
    desc: "Janji temu Anda sudah dikonfirmasi. Datang 10 menit lebih awal, ya!",
  },
  completed: {
    label: "Selesai",
    className: "bg-cream text-ink ring-ink/10",
    desc: "Perawatan sudah dilakukan. Terima kasih sudah datang — jangan lupa kontrol berikutnya.",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-red-50 text-red-700 ring-red-200",
    desc: "Booking ini dibatalkan. Ingin datang? Silakan buat booking baru.",
  },
  no_show: {
    label: "Tidak hadir",
    className: "bg-cream text-ink-soft ring-ink/10",
    desc: "Anda tidak hadir pada jadwal ini. Bila masih ingin perawatan, buat booking baru.",
  },
};

function formatDateId(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function BookingStatusPage({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  const booking = await prisma.booking.findUnique({
    where: { code: decodeURIComponent(kode).toUpperCase() },
    include: { service: true },
  });
  if (!booking) notFound();

  const status = STATUS_META[booking.status] ?? STATUS_META.pending;
  const canCancel = booking.status === "pending" || booking.status === "confirmed";
  const waReschedule = encodeURIComponent(
    `Halo, saya ingin mengubah jadwal booking ${booking.code} (nama: ${booking.name}).`,
  );

  return (
    <section className="mx-auto max-w-2xl px-5 py-16 sm:py-20">
      <div className="rounded-[1.75rem] bg-white p-7 shadow-card sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Status Booking</p>
          <span
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <p className="tabular mt-5 text-3xl font-extrabold tracking-wide text-ink sm:text-4xl">
          {booking.code}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{status.desc}</p>

        <dl className="mt-7 divide-y divide-ink/8 border-y border-ink/8 text-sm">
          {[
            ["Layanan", booking.service.name],
            ["Tanggal", formatDateId(booking.date)],
            ["Jam", `${booking.slotTime} WIB`],
            ["Nama", booking.name],
            ["WhatsApp", booking.phone],
            ...(booking.email ? [["Email", booking.email]] : []),
            ...(booking.notes ? [["Keluhan", booking.notes]] : []),
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 py-3">
              <dt className="shrink-0 text-ink-soft">{k}</dt>
              <dd className="text-right font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {canCancel && (
            <form action={cancelOwnBooking}>
              <input type="hidden" name="code" value={booking.code} />
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
              >
                Batalkan Booking
              </button>
            </form>
          )}
          {canCancel && (
            <a
              href={`https://wa.me/${site.whatsapp}?text=${waReschedule}`}
              className="text-sm font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-800"
            >
              Ubah jadwal via WhatsApp
            </a>
          )}
          {!canCancel && (
            <Link
              href="/booking"
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700"
            >
              Buat Booking Baru
            </Link>
          )}
          <Link
            href="/"
            className="text-sm font-semibold text-ink-soft underline decoration-ink/20 underline-offset-4 hover:text-ink"
          >
            Kembali ke beranda
          </Link>
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-ink-soft">
        Simpan tautan halaman ini — status booking selalu yang terbaru.
      </p>
    </section>
  );
}
