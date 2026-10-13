import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { T } from "@/components/SitePreferences";

export const metadata: Metadata = {
  title: `Kebijakan Privasi — ${site.name}`,
  description: "Bagaimana Praktik Kedokteran Gigi drg Dava mengumpulkan, menggunakan, dan melindungi data pribadi Anda (UU PDP No. 27/2022).",
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
    <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
      <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
        <span aria-hidden className="h-px w-8 bg-brand-400" /> Legal
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl"><T id="privacy.title" fallback="Kebijakan Privasi" /></h1>
      <p className="mt-3 text-sm text-ink-soft"><T id="privacy.updated" fallback="Terakhir diperbarui: 24 September 2026." /></p>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <div key={section.titleId}>
            <h2 className="text-lg font-bold text-ink"><T id={section.titleId} fallback={section.title} /></h2>
            <div className="mt-2 space-y-2">
              {section.paragraphs.map(([id, paragraph]) => (
                <p key={id} className="text-[15px] leading-relaxed text-ink-soft"><T id={id} fallback={paragraph} /></p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-[1.75rem] bg-paper p-6 ring-1 ring-ink/5">
        <p className="text-sm leading-relaxed text-ink-soft">
          <T id="privacy.contactPrompt" fallback="Ada pertanyaan soal data Anda? Hubungi kami di" /> {site.phoneDisplay} <T id="privacy.contactEmail" fallback="atau email" /> {site.email}.
        </p>
        <Link href="/booking" className="mt-4 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700">
          <T id="privacy.booking" fallback="Buat Booking" />
        </Link>
      </div>
    </section>
  );
}
