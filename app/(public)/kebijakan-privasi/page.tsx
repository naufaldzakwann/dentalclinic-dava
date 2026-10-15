import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { T } from "@/components/SitePreferences";
import Copy from "@/components/LocalizedCopy";
import { ArrowRightIcon, ShieldPlusIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: `Kebijakan Privasi — ${site.name}`,
  description: "Bagaimana Praktik Spesialis Konservasi Gigi drg. Dava Fathiyatuzzakiyah, Sp.KG. mengumpulkan, menggunakan, dan melindungi data pribadi Anda (UU PDP No. 27/2022).",
};

const sections = [
  { title: "Data yang kami kumpulkan", titleId: "privacy.section.1.title", paragraphs: [
    ["privacy.section.1.1", "Melalui form booking, kami mengumpulkan: nama lengkap, nomor WhatsApp, email (opsional), layanan dan jadwal yang Anda pilih, serta keluhan singkat yang Anda tulis sendiri."],
    ["privacy.section.1.2", "Kami tidak menyimpan data kesehatan yang rinci, hasil foto rontgen, rekam medis digital, maupun data pembayaran melalui website ini."],
  ] },
  { title: "Untuk apa data digunakan", titleId: "privacy.section.2.title", paragraphs: [
    ["privacy.section.2.1", "Data Anda hanya dipakai untuk mengelola janji temu: konfirmasi jadwal, pengingat kunjungan, penyesuaian slot bila terjadi perubahan, dan pembukuan internal praktik."],
    ["privacy.section.2.2", "Kami tidak menjual, menyewakan, atau membagikan data Anda kepada pihak ketiga untuk tujuan pemasaran."],
  ] },
  { title: "Dasar pemrosesan (UU PDP No. 27/2022)", titleId: "privacy.section.3.title", paragraphs: [
    ["privacy.section.3.1", "Pemrosesan data pribadi Anda dilakukan berdasarkan persetujuan yang Anda berikan melalui checkbox pada form booking, sebagaimana diatur Undang-Undang Perlindungan Data Pribadi No. 27 Tahun 2022."],
    ["privacy.section.3.2", "Anda dapat menarik persetujuan kapan saja dengan menghubungi kami — data yang tidak lagi diperlukan akan kami hapus."],
  ] },
  { title: "Penyimpanan & keamanan", titleId: "privacy.section.4.title", paragraphs: [
    ["privacy.section.4.1", "Data tersimpan pada infrastruktur database dengan akses terbatas hanya untuk staf klinik yang berkepentingan. Koneksi situs menggunakan HTTPS."],
    ["privacy.section.4.2", "Data booking yang sudah lama tidak aktif akan dibersihkan secara berkala."],
  ] },
  { title: "Hak Anda", titleId: "privacy.section.5.title", paragraphs: [
    ["privacy.section.5.1", "Anda berhak meminta salinan, koreksi, atau penghapusan data pribadi Anda, serta menanyakan cara pemrosesannya — cukup hubungi kami lewat WhatsApp atau email di bawah."],
    ["privacy.section.5.2", "Permintaan kami tanggapi dalam 3×24 jam pada hari kerja."],
  ] },
] as const;

export default function PrivacyPage() {
  return (
    <div className="page-shell pb-20 sm:pb-28">
      <header className="page-intro border-b border-ink/10">
        <p className="eyebrow"><Copy id="Informasi & kepercayaan" en="Information & trust" /></p>
        <h1 className="display-title mt-5"><T id="privacy.title" fallback="Kebijakan Privasi" /></h1>
        <p className="mt-5 text-sm text-ink-soft"><T id="privacy.updated" fallback="Terakhir diperbarui: 24 September 2026." /></p>
      </header>

      <div className="grid items-start gap-10 pt-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
        <aside className="rounded-[1.25rem] border border-brand-200 bg-brand-50 p-7 lg:sticky lg:top-28">
          <ShieldPlusIcon width={26} height={26} className="text-brand-700" aria-hidden="true" />
          <p className="mt-5 text-base font-semibold text-ink"><Copy id="Data Anda, dijelaskan." en="Your information, explained." /></p>
          <nav className="mt-5 space-y-2" aria-label="Privacy policy contents">
            {sections.map((section, index) => <a key={section.titleId} href={`#privacy-${index + 1}`} className="flex min-h-11 items-center gap-3 border-t border-brand-200/70 py-3 text-xs leading-6 text-ink-soft transition hover:text-brand-700"><span className="shrink-0 font-semibold text-brand-600">0{index + 1}</span><T id={section.titleId} fallback={section.title} /></a>)}
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="divide-y divide-ink/10">
            {sections.map((section, index) => (
              <section key={section.titleId} id={`privacy-${index + 1}`} className="scroll-mt-28 py-8 first:pt-0">
                <p className="mb-3 text-xs font-semibold text-brand-600">0{index + 1}</p>
                <h2 className="text-xl font-semibold tracking-tight text-ink"><T id={section.titleId} fallback={section.title} /></h2>
                <div className="mt-4 space-y-3">
                  {section.paragraphs.map(([id, paragraph]) => <p key={id} className="text-sm leading-7 text-ink-soft"><T id={id} fallback={paragraph} /></p>)}
                </div>
              </section>
            ))}
          </div>

          <section className="editorial-card mt-6 p-7 sm:p-9">
            <h2 className="text-xl font-semibold tracking-tight text-ink"><Copy id="Punya pertanyaan?" en="Have a question?" /></h2>
            <p className="mt-3 text-sm leading-7 text-ink-soft"><T id="privacy.contactPrompt" fallback="Ada pertanyaan soal data Anda? Hubungi kami di" /> <a href={`tel:${site.whatsapp}`} className="font-medium text-brand-700 underline underline-offset-4">{site.phoneDisplay}</a> <T id="privacy.contactEmail" fallback="atau email" /> <a href={`mailto:${site.email}`} className="break-all font-medium text-brand-700 underline underline-offset-4">{site.email}</a>.</p>
            <Link href="/booking" className="btn-primary mt-6"><T id="privacy.booking" fallback="Buat Booking" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link>
          </section>
        </div>
      </div>
    </div>
  );
}
