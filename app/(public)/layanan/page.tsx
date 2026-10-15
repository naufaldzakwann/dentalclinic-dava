import type { Metadata } from "next";
import Link from "next/link";
import { services, site } from "@/lib/site";
import { serviceIcons } from "@/components/service-icons";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";
import { T } from "@/components/SitePreferences";
import Copy from "@/components/LocalizedCopy";
import LocationWhatsAppLink from "@/components/LocationWhatsAppLink";

export const metadata: Metadata = {
  title: "Layanan Perawatan",
  description: `Kenali pilihan konsultasi dan perawatan gigi bersama ${site.name}, ${site.specialty.toLowerCase()}, dan rencanakan kunjungan Anda melalui booking online.`,
};

const categories = [
  { id: "consultation", label: "Konsultasi", en: "Consultation", slugs: ["konsultasi"] },
  { id: "preventive", label: "Pencegahan", en: "Preventive care", slugs: ["scaling", "gigi-anak"] },
  { id: "restorative", label: "Restorasi", en: "Restorative care", slugs: ["tambal-gigi", "perawatan-saluran-akar"] },
  { id: "aesthetic", label: "Estetika gigi", en: "Dental aesthetics", slugs: ["bleaching"] },
  { id: "surgical", label: "Bedah mulut", en: "Oral surgery", slugs: ["cabut-gigi", "odontektomi"] },
];

export default function LayananPage() {
  return (
    <div className="page-shell pb-20 sm:pb-28">
      <header className="page-intro border-b border-ink/10">
        <p className="eyebrow"><Copy id="Perawatan kami" en="Our treatments" /></p>
        <div className="mt-5 grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
          <h1 className="display-title max-w-3xl"><Copy id="Perawatan yang tepat. Senyum yang sehat." en="Thoughtful care. A healthier smile." /></h1>
          <p className="body-copy max-w-lg lg:pb-2"><Copy id="Setiap senyum punya kebutuhan berbeda. Kenali pilihan perawatan, lalu diskusikan langkah yang sesuai bersama dokter." en="Every smile has different needs. Explore your treatment options, then discuss the right next step with your dentist." /></p>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2 py-7" aria-label="Treatment categories">
        {categories.map((category) => (
          <a key={category.id} href={`#${category.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-xs font-semibold text-ink transition hover:border-brand-400 hover:text-brand-700">
            <Copy id={category.label} en={category.en} /><span aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>

      <div className="space-y-14 pt-5 sm:space-y-20">
        {categories.map((category, categoryIndex) => (
          <section key={category.id} id={category.id} className="scroll-mt-28">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs font-medium tabular-nums text-brand-600">0{categoryIndex + 1}</span>
              <h2 className="section-heading !text-2xl"><Copy id={category.label} en={category.en} /></h2>
              <div className="ml-2 h-px flex-1 bg-ink/10" aria-hidden="true" />
            </div>
            <div className={`grid gap-5 ${category.slugs.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
              {category.slugs.map((slug) => {
                const service = services.find((item) => item.slug === slug)!;
                const Icon = serviceIcons[slug] ?? serviceIcons.default;
                return (
                  <article key={slug} id={slug} className="editorial-card flex scroll-mt-28 flex-col p-7 sm:p-9">
                    <div className="flex items-center justify-between gap-4">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700"><Icon width={27} height={27} aria-hidden="true" /></span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft"><ClockIcon width={14} height={14} aria-hidden="true" /> ±{service.minutes} <T id="service.minutes" fallback="menit" /></span>
                    </div>
                    <h3 className="mt-7 text-xl font-semibold tracking-tight text-ink sm:text-2xl"><T id={`service.${slug}.name`} fallback={service.name} /></h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-ink-soft"><T id={`service.${slug}.desc`} fallback={service.desc} /></p>
                    <LocationWhatsAppLink purpose="service" serviceSlug={slug} className="mt-7 inline-flex min-h-11 items-center justify-between gap-5 border-t border-ink/10 pt-5 text-sm font-semibold text-brand-700 transition hover:text-brand-500">
                      <Copy id="Diskusikan perawatan" en="Discuss this treatment" /><ArrowRightIcon width={19} height={19} aria-hidden="true" />
                    </LocationWhatsAppLink>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 grid gap-7 rounded-[1.5rem] border border-brand-200 bg-brand-50 p-8 sm:mt-20 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="eyebrow"><Copy id="Mulai dengan konsultasi" en="Start with a consultation" /></p>
          <h2 className="section-heading mt-3 max-w-xl"><Copy id="Belum yakin harus mulai dari mana?" en="Not sure where to start?" /></h2>
          <p className="body-copy mt-3 max-w-xl !text-sm"><Copy id="Sampaikan keluhan Anda saat membuat janji. Dokter akan membantu menentukan perawatan setelah pemeriksaan." en="Tell us what’s bothering you when you book. Your dentist will help determine your treatment after an examination." /></p>
        </div>
        <Link href="/booking" className="btn-primary justify-self-start"><Copy id="Jadwalkan kunjungan" en="Book a visit" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
