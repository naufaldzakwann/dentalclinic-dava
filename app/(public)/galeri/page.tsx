import type { Metadata } from "next";
import { T } from "@/components/SitePreferences";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Galeri foto praktik drg Dava Fathiyatuzzakiyah — ruang perawatan, sterilisasi, dan dokumentasi hasil perawatan.",
};

const tiles = [
  { label: "Ruang tunggu", note: "Nyaman & ber-AC", id: "waiting", noteId: "waitingNote" },
  { label: "Unit perawatan", note: "Chair modern & steril", id: "treatment", noteId: "treatmentNote" },
  { label: "Area sterilisasi", note: "Instrumen terdokumentasi", id: "sterilization", noteId: "sterilizationNote" },
  { label: "Play area anak", note: "Biar si kecil tenang", id: "children", noteId: "childrenNote" },
  { label: "Resepsionis", note: "Registrasi cepat", id: "reception", noteId: "receptionNote" },
  { label: "Sebelum – Sesudah", note: "Dokumentasi pasien (dengan izin)", id: "results", noteId: "resultsNote" },
];

export default function GaleriPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-600"><T id="gallery.kicker" fallback="Galeri" /></p>
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl"><T id="gallery.title" fallback="Lihat langsung praktiknya" /></h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          <T id="gallery.description" fallback="Foto asli klinik akan mengisi galeri ini segera setelah sesi pemotretan selesai." />
        </p>
      </header>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t, i) => (
          <figure
            key={t.label}
            className="group overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-card"
          >
            <div
              className={`grid aspect-[4/3] place-items-center bg-gradient-to-br ${
                i % 3 === 0
                  ? "from-brand-200 to-brand-50"
                  : i % 3 === 1
                    ? "from-accent-100 to-cream"
                    : "from-brand-100 to-accent-100"
              }`}
            >
              <span className="text-4xl opacity-40 transition group-hover:scale-110" aria-hidden>
                🦷
              </span>
            </div>
            <figcaption className="p-5">
                <p className="font-bold text-ink"><T id={`gallery.${t.id}`} fallback={t.label} /></p>
                <p className="mt-0.5 text-xs text-ink-soft"><T id={`gallery.${t.noteId}`} fallback={t.note} /></p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
