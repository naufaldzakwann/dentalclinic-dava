import type { Metadata } from "next";
import { site } from "@/lib/site";
import { waLink, waBookingMessage } from "@/lib/wa";
import { CheckIcon, ToothIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Tentang",
  description: `Profil ${site.fullName} — pendekatan perawatan yang telaten, edukatif, dan nyaman untuk semua usia.`,
};

const focuses = [
  "Pemeriksaan & pencegahan sejak dini",
  "Perawatan gigi keluarga — dari anak hingga lansia",
  "Perawatan dengan rasa nyaman (anestesi seperlunya)",
  "Edukasi cara merawat gigi di rumah",
];

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Foto — placeholder hingga foto asli tersedia */}
        <div className="lg:sticky lg:top-24">
          <div className="relative overflow-hidden rounded-[2rem] border border-brand-200/60 bg-gradient-to-br from-brand-100 via-cream to-brand-50 shadow-lift">
            <div className="grid aspect-[4/5] place-items-center">
              <div className="text-center">
                <span className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-brand-600 text-white shadow-card">
                  <ToothIcon width={34} height={34} />
                </span>
                <p className="text-sm font-semibold text-brand-800">drg Dava Fathiyatuzzakiyah</p>
                <p className="mt-1 text-xs text-brand-700/70">Foto profesional menyusul</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-600">Tentang</p>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            drg Dava Fathiyatuzzakiyah
          </h1>
          <p className="mt-1.5 text-sm font-medium text-ink-soft">Dokter Gigi Umum</p>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
            <p>
              Saya percaya pengalaman ke dokter gigi seharusnya tidak bikin tegang. Praktik ini
              saya bangun dengan prinsip sederhana: jelaskan dulu, baru mulai — supaya setiap
              pasien tahu apa yang terjadi di mulutnya dan kenapa perawatan itu perlu.
            </p>
            <p>
              Setiap perawatan dimulai dari pemeriksaan menyeluruh, lalu rencana perawatan yang
              diprioritaskan sesuai kondisi dan anggaran Anda. Tidak ada tindakan yang disarankan
              hanya karena &ldquo;sekalian aja&rdquo;.
            </p>
            <p>
              {/* TODO: lengkapi dengan data faktual drg Dava — pendidikan, pengalaman praktik, sertifikasi. */}
              Untuk profil pendidikan dan pengalaman lengkap, segera diperbarui di halaman ini.
            </p>
          </div>

          <h2 className="mt-10 text-xl font-bold text-ink">Fokus perawatan</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {focuses.map((f) => (
              <li key={f} className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white p-4 text-sm text-ink shadow-card">
                <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-brand-600" />
                {f}
              </li>
            ))}
          </ul>

          <figure className="mt-10 rounded-3xl border border-brand-200/60 bg-brand-50/60 p-7">
            <blockquote className="text-lg font-medium leading-relaxed text-brand-900">
              &ldquo;Gigi yang sehat nggak harus mahal — yang penting perawatannya tepat dan
              konsisten.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm text-brand-700">— drg Dava</figcaption>
          </figure>

          <a
            href={waLink(waBookingMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lift transition hover:bg-brand-700"
          >
            Buat Janji Temu dengan drg Dava
          </a>
        </div>
      </div>
    </div>
  );
}
