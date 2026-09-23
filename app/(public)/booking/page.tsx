import type { Metadata } from "next";
import { site } from "@/lib/site";
import BookingForm from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: `Booking Online — ${site.name}`,
  description:
    "Buat janji temu online di Praktik Kedokteran Gigi drg Dava: pilih layanan, tanggal, dan jam — dapatkan kode booking langsung.",
};

export default function BookingPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
      <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
        <span aria-hidden className="h-px w-8 bg-brand-400" />
        Booking Online
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Amankan tempat Anda dalam 3 langkah
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">
        Pilih layanan, tentukan jadwal, dan isi data singkat. Setelah dikirim, Anda mendapat kode
        booking — staf klinik akan konfirmasi lewat WhatsApp.
      </p>
      <div className="mt-8">
        <BookingForm />
      </div>
    </section>
  );
}
