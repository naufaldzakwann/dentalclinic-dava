import type { Metadata } from "next";
import Link from "next/link";
import { site, hours } from "@/lib/site";
import { ArrowRightIcon, PhoneIcon, MapPinIcon, ClockIcon, ChatIcon } from "@/components/icons";
import { T } from "@/components/SitePreferences";
import Copy from "@/components/LocalizedCopy";
import ClinicSelector from "@/components/ClinicSelector";
import LocationWhatsAppLink from "@/components/LocationWhatsAppLink";

export const metadata: Metadata = {
  title: "Kontak & Lokasi",
  description: "Temukan lokasi praktik, lihat jam kunjungan, dan hubungi praktik drg. Dava Fathiyatuzzakiyah.",
};

export default function KontakPage() {
  return (
    <div className="page-shell pb-20 sm:pb-28">
      <header className="page-intro">
        <p className="eyebrow"><Copy id="Mari terhubung" en="Let’s connect" /></p>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
          <h1 className="display-title"><Copy id="Senyum sehat Anda dimulai di sini." en="Your healthier smile starts here." /></h1>
          <p className="body-copy lg:pb-2"><Copy id="Punya pertanyaan atau ingin menjadwalkan kunjungan? Pilih lokasi praktik Anda dan hubungi kami." en="Have a question or ready to arrange a visit? Choose your practice location and get in touch." /></p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="editorial-card p-7 sm:p-10" aria-labelledby="location-heading">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700"><MapPinIcon width={22} height={22} aria-hidden="true" /></span>
          <p className="eyebrow mt-7"><Copy id="Riau, Indonesia" en="Riau, Indonesia" /></p>
          <h2 id="location-heading" className="section-heading mt-3"><Copy id="Pilih lokasi kunjungan." en="Choose where to visit." /></h2>
          <p className="body-copy mb-7 mt-4 !text-sm"><Copy id="Lokasi yang Anda pilih akan disertakan saat menghubungi kami atau membuat booking online." en="Your selected location will be included when you contact us or make an online booking." /></p>
          <ClinicSelector variant="cards" />
          <div className="mt-7 border-t border-ink/10 pt-6">
            <p className="text-sm leading-7 text-ink-soft"><Copy id="Untuk alamat lengkap dan petunjuk kedatangan, hubungi kami sebelum kunjungan Anda." en="Contact us before your visit for the full address and arrival directions." /></p>
            <LocationWhatsAppLink purpose="question" className="mt-4 inline-flex min-h-11 items-center gap-4 text-sm font-semibold text-brand-700"><Copy id="Tanyakan lokasi di WhatsApp" en="Ask for directions on WhatsApp" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></LocationWhatsAppLink>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-brand-200 bg-brand-50 p-7 sm:p-10" aria-labelledby="hours-heading">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-brand-200 text-brand-700"><ClockIcon width={22} height={22} aria-hidden="true" /></span>
          <h2 id="hours-heading" className="section-heading mt-7 !text-2xl"><Copy id="Jam praktik" en="Practice hours" /></h2>
          <dl className="mt-6 divide-y divide-brand-200/70 text-sm">
            {hours.map((item, index) => (
              <div key={item.day} className="flex flex-wrap items-center justify-between gap-2 py-5">
                <dt className="text-ink-soft"><T id={["footer.weekdays", "footer.saturday", "footer.sunday"][index]} fallback={item.day} /></dt>
                <dd className="font-semibold tabular-nums text-ink">{item.time === "Tutup" ? <T id="footer.closed" fallback="Tutup" /> : item.time}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs leading-6 text-ink-soft"><Copy id="Waktu Indonesia Barat (WIB / UTC+7). Konfirmasikan jadwal dan lokasi praktik sebelum datang." en="Western Indonesia Time (WIB / UTC+7). Please confirm your appointment time and practice location before visiting." /></p>
        </section>
      </div>

      <section className="mt-6 grid gap-6 md:grid-cols-2" aria-label="Contact options">
        <LocationWhatsAppLink purpose="question" className="editorial-card group flex items-start gap-5 p-7 transition hover:border-brand-300 sm:p-9">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700"><ChatIcon width={23} height={23} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1"><h2 className="text-xl font-semibold text-ink">WhatsApp</h2><p className="mt-2 text-sm text-ink-soft">{site.phoneDisplay}</p><p className="mt-4 flex items-center gap-3 text-sm font-semibold text-brand-700"><Copy id="Mulai percakapan" en="Start a conversation" /><ArrowRightIcon width={17} height={17} aria-hidden="true" /></p></div>
        </LocationWhatsAppLink>
        <a href={`tel:${site.whatsapp}`} className="editorial-card group flex items-start gap-5 p-7 transition hover:border-brand-300 sm:p-9">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700"><PhoneIcon width={23} height={23} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1"><h2 className="text-xl font-semibold text-ink"><Copy id="Telepon" en="Call the practice" /></h2><p className="mt-2 text-sm text-ink-soft">{site.phoneDisplay}</p><p className="mt-4 text-sm text-ink-soft"><Copy id="Hubungi selama jam praktik." en="Reach us during practice hours." /></p></div>
        </a>
      </section>

      <section className="mt-14 flex flex-col justify-between gap-6 border-t border-ink/10 pt-10 sm:flex-row sm:items-center">
        <div><h2 className="text-xl font-semibold tracking-tight text-ink"><Copy id="Sudah siap untuk berkunjung?" en="Ready for your visit?" /></h2><p className="mt-2 text-sm text-ink-soft"><Copy id="Pilih jadwal Anda melalui booking online." en="Choose your appointment through online booking." /></p></div>
        <Link href="/booking" className="btn-primary self-start sm:self-auto"><Copy id="Buat janji temu" en="Book an appointment" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
