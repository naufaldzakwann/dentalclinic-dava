import type { Metadata } from "next";
import Link from "next/link";
import BookingForm from "@/components/booking/BookingForm";
import Copy from "@/components/LocalizedCopy";
import { ArrowRightIcon, ChatIcon, ShieldPlusIcon } from "@/components/icons";
import LocationWhatsAppLink from "@/components/LocationWhatsAppLink";

export const metadata: Metadata = {
  title: "Buat Janji Temu",
  description: "Jadwalkan kunjungan Anda: pilih lokasi praktik, layanan, tanggal, dan waktu yang tersedia, lalu dapatkan kode booking.",
};

export default function BookingPage() {
  return (
    <div className="page-shell pb-20 sm:pb-28">
      <header className="page-intro border-b border-ink/10">
        <p className="eyebrow"><Copy id="Janji temu Anda" en="Your appointment" /></p>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <h1 className="display-title max-w-2xl"><Copy id="Luangkan waktu untuk senyum Anda." en="Make time for your smile." /></h1>
          <p className="body-copy lg:pb-2"><Copy id="Pilih lokasi dan waktu yang sesuai. Setelah booking terkirim, simpan kode Anda dan tunggu konfirmasi melalui WhatsApp." en="Choose a location and a time that works for you. Once you’ve booked, save your code and look out for confirmation on WhatsApp." /></p>
        </div>
      </header>

      <div className="grid items-start gap-8 pt-10 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-10">
        <div className="min-w-0"><BookingForm /></div>
        <aside className="space-y-5 lg:sticky lg:top-28">
          <section className="rounded-[1.25rem] border border-brand-200 bg-brand-50 p-7">
            <span className="eyebrow"><Copy id="Sebelum berkunjung" en="Before your visit" /></span>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink"><Copy id="Satu langkah lebih dekat." en="One step closer." /></h2>
            <ol className="mt-6 space-y-5">
              {[
                { id: "Pilih lokasi dan perawatan.", en: "Select your location and treatment." },
                { id: "Tentukan tanggal dan waktu yang tersedia.", en: "Choose an available date and time." },
                { id: "Isi data kontak dan kirim booking.", en: "Add your contact details and book." },
                { id: "Simpan kode dan tunggu konfirmasi.", en: "Save your code and wait for confirmation." },
              ].map((step, index) => <li key={step.en} className="flex items-start gap-3 text-xs leading-6 text-ink-soft"><span className="font-semibold text-brand-700">0{index + 1}</span><Copy id={step.id} en={step.en} /></li>)}
            </ol>
          </section>
          <section className="editorial-card p-7">
            <ChatIcon width={23} height={23} className="text-brand-600" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold text-ink"><Copy id="Butuh bantuan?" en="Need a hand?" /></h2>
            <p className="mt-2 text-xs leading-6 text-ink-soft"><Copy id="Anda juga dapat bertanya dan mengatur janji melalui WhatsApp." en="You can also ask a question or arrange a visit through WhatsApp." /></p>
            <LocationWhatsAppLink purpose="question" className="mt-4 flex min-h-11 items-center justify-between gap-3 text-xs font-semibold text-brand-700"><Copy id="Hubungi kami" en="Get in touch" /><ArrowRightIcon width={17} height={17} aria-hidden="true" /></LocationWhatsAppLink>
          </section>
          <div className="flex items-start gap-3 px-2 py-2 text-xs leading-6 text-ink-soft"><ShieldPlusIcon width={19} height={19} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" /><p><Copy id="Pelajari penggunaan data Anda dalam" en="Learn how your information is used in our" /> <Link href="/kebijakan-privasi" className="font-semibold text-brand-700 underline underline-offset-4"><Copy id="kebijakan privasi" en="privacy policy" /></Link>.</p></div>
        </aside>
      </div>
    </div>
  );
}
