import type { Metadata } from "next";
import { services, rupiah } from "@/lib/site";
import { waLink, waBookingMessage } from "@/lib/wa";
import { serviceIcons } from "@/components/service-icons";

export const metadata: Metadata = {
  title: "Layanan & Harga",
  description:
    "Daftar layanan praktik drg Dava Fathiyatuzzakiyah: scaling, tambal gigi, perawatan saluran akar, cabut gigi, odontektomi, bleaching, behel, dan perawatan gigi anak — dengan harga mulai yang transparan.",
};

export default function LayananPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-600">Layanan</p>
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">Perawatan &amp; harga</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          Semua harga di bawah adalah <strong>harga mulai</strong> sebagai gambaran. Biaya final
          ditetapkan setelah pemeriksaan dan kami sepakati di awal — tidak ada biaya siluman.
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
                  <h2 className="text-lg font-bold text-ink">{s.name}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <div className="flex gap-1.5">
                      <dt className="text-ink-soft">Biaya mulai</dt>
                      <dd className="font-semibold text-brand-700">
                        {s.priceFrom ? rupiah(s.priceFrom) : "konsultasi dulu"}
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-ink-soft">Durasi ±</dt>
                      <dd className="font-semibold text-ink">{s.minutes} menit</dd>
                    </div>
                  </dl>
                  <a
                    href={waLink(`${waBookingMessage}${s.name}. `)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700"
                  >
                    Tanya / Booking via WhatsApp
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-ink-soft">
        * Harga dapat berubah sewaktu-waktu; konfirmasi saat booking. Untuk perawatan khusus
        (odontektomi, PSA dengan kesulitan tertentu), dokter akan menjelaskan estimasi setelah
        pemeriksaan.
      </p>
    </div>
  );
}
