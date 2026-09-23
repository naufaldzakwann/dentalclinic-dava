import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Kebijakan Privasi — ${site.name}`,
  description:
    "Bagaimana Praktik Kedokteran Gigi drg Dava mengumpulkan, menggunakan, dan melindungi data pribadi Anda (UU PDP No. 27/2022).",
};

const sections: Array<{ title: string; body: string[] }> = [
  {
    title: "Data yang kami kumpulkan",
    body: [
      "Melalui form booking, kami mengumpulkan: nama lengkap, nomor WhatsApp, email (opsional), layanan dan jadwal yang Anda pilih, serta keluhan singkat yang Anda tulis sendiri.",
      "Kami tidak menyimpan data kesehatan yang rinci, hasil foto rontgen, rekam medis digital, maupun data pembayaran melalui website ini.",
    ],
  },
  {
    title: "Untuk apa data digunakan",
    body: [
      "Data Anda hanya dipakai untuk mengelola janji temu: konfirmasi jadwal, pengingat kunjungan, penyesuaian slot bila terjadi perubahan, dan pembukuan internal praktik.",
      "Kami tidak menjual, menyewakan, atau membagikan data Anda kepada pihak ketiga untuk tujuan pemasaran.",
    ],
  },
  {
    title: "Dasar pemrosesan (UU PDP No. 27/2022)",
    body: [
      "Pemrosesan data pribadi Anda dilakukan berdasarkan persetujuan yang Anda berikan melalui checkbox pada form booking, sebagaimana diatur Undang-Undang Perlindungan Data Pribadi No. 27 Tahun 2022.",
      "Anda dapat menarik persetujuan kapan saja dengan menghubungi kami — data yang tidak lagi diperlukan akan kami hapus.",
    ],
  },
  {
    title: "Penyimpanan & keamanan",
    body: [
      "Data tersimpan pada infrastruktur database dengan enkripsi at-rest dan akses terbatas hanya untuk staf klinik yang berkepentingan. Koneksi situs menggunakan HTTPS.",
      "Data booking yang sudah lama tidak aktif akan dibersihkan secara berkala.",
    ],
  },
  {
    title: "Hak Anda",
    body: [
      "Anda berhak meminta salinan, koreksi, atau penghapusan data pribadi Anda, serta menanyakan cara pemrosesannya — cukup hubungi kami lewat WhatsApp atau email di bawah.",
      "Permintaan kami tanggapi dalam 3×24 jam pada hari kerja.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
      <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
        <span aria-hidden className="h-px w-8 bg-brand-400" />
        Legal
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Kebijakan Privasi</h1>
      <p className="mt-3 text-sm text-ink-soft">Terakhir diperbarui: 24 September 2026.</p>

      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-lg font-bold text-ink">{s.title}</h2>
            <div className="mt-2 space-y-2">
              {s.body.map((p) => (
                <p key={p} className="text-[15px] leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-[1.75rem] bg-paper p-6 ring-1 ring-ink/5">
        <p className="text-sm leading-relaxed text-ink-soft">
          Ada pertanyaan soal data Anda? Hubungi kami di {site.phoneDisplay} atau email {site.email}.
        </p>
        <Link
          href="/booking"
          className="mt-4 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700"
        >
          Buat Booking
        </Link>
      </div>
    </section>
  );
}
