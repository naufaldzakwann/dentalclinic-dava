import type { Metadata } from "next";
import { site, hours } from "@/lib/site";
import { PhoneIcon, MapPinIcon, ClockIcon, ChatIcon } from "@/components/icons";
import { T } from "@/components/SitePreferences";
import ClinicSelector from "@/components/ClinicSelector";
import LocationWhatsAppLink from "@/components/LocationWhatsAppLink";

export const metadata: Metadata = {
  title: "Kontak & Lokasi",
  description: "Lokasi klinik, jam praktik, dan cara menghubungi praktik drg Dava Fathiyatuzzakiyah.",
};

export default function KontakPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-600"><T id="contact.kicker" fallback="Kontak" /></p>
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl"><T id="contact.title" fallback="Kunjungi salah satu klinik kami" /></h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg"><T id="contact.description" fallback="Pilih klinik yang ingin Anda kunjungi. Kontak dan jam praktik saat ini digunakan bersama untuk kedua lokasi." /></p>
      </header>

      <section className="mt-10 rounded-[1.75rem] border border-ink/8 bg-white p-6 shadow-card sm:p-8" aria-labelledby="location-heading">
        <div className="mb-5 flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><MapPinIcon width={20} height={20} /></span>
          <div>
            <h2 id="location-heading" className="font-bold text-ink"><T id="contact.selectLocation" fallback="Pilih lokasi klinik" /></h2>
            <p className="mt-1 text-sm text-ink-soft"><T id="location.prompt" fallback="Pilih klinik yang ingin Anda kunjungi." /></p>
          </div>
        </div>
        <ClinicSelector variant="cards" />
        <p className="mt-4 text-xs text-ink-soft"><T id="location.addressPending" fallback="Alamat lengkap segera ditambahkan" /> · <T id="common.region" fallback="Riau, Indonesia" /></p>
      </section>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <LocationWhatsAppLink className="group rounded-3xl border border-ink/8 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#25D366]/10 text-[#1ebe5d]"><ChatIcon width={22} height={22} /></span>
          <h2 className="mt-4 font-bold text-ink"><T id="contact.whatsapp" fallback="WhatsApp" /></h2>
          <p className="mt-1 text-sm text-ink-soft">{site.phoneDisplay}</p>
          <p className="mt-3 text-sm font-semibold text-brand-700 group-hover:text-brand-800"><T id="contact.chatNow" fallback="Chat sekarang" /> →</p>
        </LocationWhatsAppLink>

        <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600"><PhoneIcon width={22} height={22} /></span>
          <h2 className="mt-4 font-bold text-ink"><T id="contact.call" fallback="Telepon" /></h2>
          <a className="mt-1 inline-block text-sm text-ink-soft hover:text-brand-700" href={`tel:${site.whatsapp}`}>{site.phoneDisplay}</a>
          <p className="mt-3 text-xs text-ink-soft"><T id="contact.callHours" fallback="Dapat dihubungi selama jam praktik." /></p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600"><ClockIcon width={22} height={22} /></span>
          <h2 className="mt-4 font-bold text-ink"><T id="contact.hours" fallback="Jam Praktik" /></h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft"><T id="contact.shared" fallback="Kedua klinik saat ini menggunakan nomor telepon dan jam praktik yang sama." /></p>
          <dl className="mt-3 divide-y divide-ink/5 text-sm">
            {hours.map((item, index) => (
              <div key={item.day} className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-ink-soft"><T id={["footer.weekdays", "footer.saturday", "footer.sunday"][index]} fallback={item.day} /></dt>
                <dd className={`font-semibold ${item.time === "Tutup" ? "text-red-500/80" : "text-ink"}`}>
                  {item.time === "Tutup" ? <T id="footer.closed" fallback="Tutup" /> : item.time}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="grid min-h-64 place-items-center rounded-3xl border-2 border-dashed border-brand-300/70 bg-brand-50/40 p-6 text-center">
          <div>
            <MapPinIcon width={28} height={28} className="mx-auto text-brand-500" />
            <p className="mt-3 text-sm font-semibold text-ink"><T id="contact.mapsPending" fallback="Peta lokasi menyusul" /></p>
            <p className="mt-1 max-w-sm text-xs text-ink-soft"><T id="contact.mapsDescription" fallback="Peta akan tersedia setelah alamat lengkap klinik dikonfirmasi." /></p>
          </div>
        </section>
      </div>
    </div>
  );
}
