import type { Metadata } from "next";
import { services } from "@/lib/site";
import { serviceIcons } from "@/components/service-icons";
import { T } from "@/components/SitePreferences";
import LocationWhatsAppLink from "@/components/LocationWhatsAppLink";

export const metadata: Metadata = {
  title: "Layanan Perawatan",
  description:
    "Pilihan perawatan praktik drg Dava Fathiyatuzzakiyah: scaling, tambal gigi, perawatan saluran akar, cabut gigi, odontektomi, pemutihan gigi, behel, dan perawatan gigi anak.",
};

export default function LayananPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-600"><T id="service.page.kicker" fallback="Layanan" /></p>
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl"><T id="service.page.title" fallback="Perawatan untuk senyum sehat" /></h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          <T id="service.page.description" fallback="Pilih perawatan yang ingin Anda ketahui. Dokter akan memeriksa kondisi gigi dan menjelaskan langkah yang sesuai saat konsultasi." />
        </p>
      </header>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {services.map((s) => {
          const Icon = serviceIcons[s.slug] ?? serviceIcons.default;
          return (
            <article
              key={s.slug}
              id={s.slug}
              className="scroll-mt-24 rounded-3xl border border-ink/8 bg-white p-6 shadow-card"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon width={22} height={22} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-ink"><T id={`service.${s.slug}.name`} fallback={s.name} /></h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft"><T id={`service.${s.slug}.desc`} fallback={s.desc} /></p>
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <div className="flex gap-1.5">
                      <dt className="text-ink-soft"><T id="service.duration" fallback="Durasi ±" /></dt>
                      <dd className="font-semibold text-ink">{s.minutes} <T id="service.minutes" fallback="menit" /></dd>
                    </div>
                  </dl>
                  <LocationWhatsAppLink
                    purpose="service"
                    serviceSlug={s.slug}
                    className="mt-5 inline-flex rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700"
                  >
                    <T id="service.ask" fallback="Tanya / Booking via WhatsApp" />
                  </LocationWhatsAppLink>
                </div>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
}
