import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { ArrowRightIcon, CheckIcon, ToothIcon } from "@/components/icons";
import { T } from "@/components/SitePreferences";
import Copy from "@/components/LocalizedCopy";

export const metadata: Metadata = {
  title: "Tentang Dokter",
  description: `Kenali ${site.fullName} dan pendekatan perawatan yang mengutamakan penjelasan serta kebutuhan pasien.`,
};

const focuses = [
  { id: "Pemeriksaan & pencegahan sejak dini", en: "Early examinations and prevention" },
  { id: "Konservasi gigi dan perawatan saluran akar", en: "Conservative dentistry and root canal care" },
  { id: "Penjelasan sebelum setiap tindakan", en: "Clear explanations before treatment" },
  { id: "Panduan merawat gigi di rumah", en: "Guidance for looking after your teeth at home" },
];

const journey = [
  { title: "Kami mendengarkan", en: "We listen", body: "Ceritakan keluhan, kebutuhan, atau kecemasan Anda. Ada waktu untuk bertanya.", bodyEn: "Tell us about your concerns, needs, or worries. There’s time for your questions." },
  { title: "Kami memeriksa", en: "We examine", body: "Pemeriksaan membantu dokter memahami kondisi gigi dan gusi Anda.", bodyEn: "An examination helps your dentist understand the condition of your teeth and gums." },
  { title: "Kita merencanakan", en: "We plan together", body: "Pilihan dan prioritas perawatan dijelaskan agar Anda dapat mengambil keputusan.", bodyEn: "We explain your options and priorities so you can make an informed decision." },
  { title: "Perawatan berlanjut", en: "Care continues", body: "Anda mendapat arahan perawatan di rumah dan jadwal kontrol bila diperlukan.", bodyEn: "You receive advice for care at home and follow-up visits when needed." },
];

export default function TentangPage() {
  return (
    <div className="page-shell pb-20 sm:pb-28">
      <header className="page-intro">
        <p className="eyebrow"><Copy id="Kenali dokter Anda" en="Meet your dentist" /></p>
        <h1 className="display-title mt-5 max-w-4xl"><Copy id="Perawatan personal, dimulai dari rasa percaya." en="Personal care begins with trust." /></h1>
      </header>

      <section className="grid gap-10 border-y border-ink/10 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[1.5rem] bg-brand-900 p-8 text-white sm:p-10">
          <div className="absolute -right-14 top-14 h-80 w-80 rounded-full border border-white/10" aria-hidden="true" />
          <div className="absolute -right-6 top-22 h-64 w-64 rounded-full border border-white/10" aria-hidden="true" />
          <span className="relative text-xs uppercase tracking-[0.22em] text-white/70">Dava Dental Care</span>
          <ToothIcon width={156} height={156} strokeWidth={0.7} className="relative my-8 self-center text-brand-200" aria-hidden="true" />
          <div className="relative border-t border-white/20 pt-6">
            <p className="text-2xl font-medium leading-tight">{site.name}</p>
            <p className="mt-3 text-xs uppercase leading-6 tracking-[0.15em] text-white/65"><T id="about.role" fallback={site.specialty} /></p>
          </div>
        </div>

        <div className="self-center">
          <p className="eyebrow"><Copy id="Filosofi perawatan" en="Our approach" /></p>
          <h2 className="section-heading mt-4"><Copy id="Penjelasan yang jelas. Pilihan yang Anda pahami." en="Clear explanations. Choices you understand." /></h2>
          <div className="body-copy mt-6 space-y-4 !text-[15px]">
            <p><T id="about.p1" fallback="Saya percaya pengalaman ke dokter gigi seharusnya tidak bikin tegang. Praktik ini saya bangun dengan prinsip sederhana: jelaskan dulu, baru mulai — supaya setiap pasien tahu apa yang terjadi di mulutnya dan kenapa perawatan itu perlu." /></p>
            <p><T id="about.p2" fallback="Setiap perawatan dimulai dari pemeriksaan menyeluruh, lalu rencana perawatan yang diprioritaskan sesuai kondisi dan kebutuhan Anda. Setiap pilihan dijelaskan sebelum perawatan dilakukan." /></p>
          </div>
          <ul className="mt-7 space-y-3.5 border-t border-ink/10 pt-7">
            {focuses.map((focus) => <li key={focus.en} className="flex items-start gap-3 text-sm leading-6 text-ink"><CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" /><Copy id={focus.id} en={focus.en} /></li>)}
          </ul>
          <Link href="/booking" className="btn-primary mt-8"><Copy id="Buat janji temu" en="Make an appointment" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="section-space">
        <div className="mb-10 grid gap-4 md:grid-cols-2 md:items-end">
          <div><p className="eyebrow"><Copy id="Kunjungan Anda" en="Your visit" /></p><h2 className="section-heading mt-3"><Copy id="Anda ikut dalam setiap keputusan." en="You’re part of every decision." /></h2></div>
          <p className="body-copy max-w-md md:justify-self-end"><Copy id="Kami ingin Anda memahami apa yang akan dilakukan dan alasan di baliknya, sejak konsultasi pertama." en="We want you to understand what happens and why, starting with your first consultation." /></p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((step, index) => <article key={step.en} className="editorial-card p-7"><p className="text-sm font-medium text-brand-600">0{index + 1}</p><h3 className="mt-8 text-lg font-semibold tracking-tight text-ink"><Copy id={step.title} en={step.en} /></h3><p className="mt-3 text-sm leading-7 text-ink-soft"><Copy id={step.body} en={step.bodyEn} /></p></article>)}
        </div>
      </section>
    </div>
  );
}
