import Link from "next/link";
import { services, featuredSlugs, rupiah } from "@/lib/site";
import { ArrowRightIcon, SparkleIcon, ShieldPlusIcon, ChatIcon, WalletIcon, HeartIcon, SunIcon, WrenchIcon, SmileIcon, ToothIcon, StarIcon } from "./icons";
import type { ComponentType, SVGProps, ReactNode } from "react";
import { waLink, waBookingMessage } from "@/lib/wa";

const serviceIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  scaling: SparkleIcon,
  "tambal-gigi": ToothIcon,
  "perawatan-saluran-akar": ShieldPlusIcon,
  "cabut-gigi": WrenchIcon,
  odontektomi: SmileIcon,
  bleaching: SunIcon,
  ortodonti: SmileIcon,
  "gigi-anak": HeartIcon,
};

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-600">{children}</p>
  );
}

/* ————— Beranda: layanan unggulan ————— */
export function ServicesPreview() {
  const featured = featuredSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter(Boolean) as typeof services;

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24" id="layanan">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Kicker>Layanan</Kicker>
          <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Perawatan lengkap untuk tiap kebutuhan
          </h2>
        </div>
        <Link
          href="/layanan"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
        >
          Lihat semua layanan
          <ArrowRightIcon width={16} height={16} className="transition group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((s) => {
          const Icon = serviceIcons[s.slug] ?? ToothIcon;
          return (
            <Link
              key={s.slug}
              href={`/layanan#${s.slug}`}
              className="group rounded-3xl border border-ink/8 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon width={22} height={22} />
              </span>
              <h3 className="text-lg font-bold text-ink">{s.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.short}</p>
              <p className="mt-4 text-sm font-semibold text-ink">
                {s.priceFrom ? (
                  <>
                    Mulai <span className="text-brand-700">{rupiah(s.priceFrom)}</span>
                  </>
                ) : (
                  "Konsultasi terlebih dahulu"
                )}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ————— Beranda: keunggulan ————— */
const whyUs = [
  {
    icon: ChatIcon,
    title: "Penjelasan sebelum tindakan",
    text: "Tidak ada kejutan. Kondisi gigi, opsi perawatan, dan estimasi biaya dibahas dulu — baru mulai saat Anda siap.",
  },
  {
    icon: ShieldPlusIcon,
    title: "Sterilisasi standar klinik",
    title2: "",
    text: "Setiap instrumen melalui sterilisasi bertahap; disposabel seperlunya. Aman dan terdokumentasi.",
  },
  {
    icon: WalletIcon,
    title: "Tanpa biaya tersembunyi",
    text: "Harga mulai tertera jelas. Biaya final disepakati di awal setelah pemeriksaan — bukan saat pembayaran.",
  },
  {
    icon: HeartIcon,
    title: "Ramah semua usia",
    text: "Dari anak 4 tahun hingga lansia — pendekatan perawatan disesuaikan agar semua nyaman.",
  },
] as const;

export function WhyUs() {
  return (
    <section className="border-y border-ink/5 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Kicker>Mengapa ke sini</Kicker>
        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Nyaman itu bagian dari perawatan
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {whyUs.map((w) => (
            <div key={w.title} className="flex gap-4">
              <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <w.icon width={22} height={22} />
              </span>
              <div>
                <h3 className="font-bold text-ink">{w.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{w.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————— Beranda: testimoni ————— */
export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <Kicker>Kata pasien</Kicker>
      <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Mereka sudah berani senyum lebar
      </h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            name: "Sari W.",
            tag: "Pasien scaling",
            text: "Penjelasannya detail banget sebelum mulai, jadi nggak cemas. Scaling-nya juga nggak sakit sama sekali. Rutenya enak.",
          },
          {
            name: "Bayu P.",
            tag: "Pasien perawatan saluran akar",
            text: "Pernah takut ke dokter gigi bertahun-tahun. Di sini sabar banget, langkahnya dijelaskan satu per satu. Sekarang malah rutin kontrol.",
          },
          {
            name: "Nadia & Ayra",
            tag: "Pasien gigi anak",
            text: "Anak saya yang tadinya nangis di klinik lain, di sini malah betah. Tambal gigi susunya beres tanpa drama.",
          },
        ].map((t) => (
          <figure key={t.name} className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card">
            <div className="flex gap-0.5 text-amber-400" aria-label="Rating 5 dari 5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <blockquote className="mt-4 text-[15px] leading-relaxed text-ink">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-bold text-ink">{t.name}</span>
              <span className="text-ink-soft"> · {t.tag}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ————— Beranda: FAQ ————— */
export function Faq() {
  const items = [
    {
      q: "Apakah harus membuat janji temu dulu?",
      a: "Sangat disarankan. Dengan janji temu, waktu tunggu Anda minimal dan dokter sudah menyiapkan perawatan yang Anda butuhkan. Booking bisa lewat tombol WhatsApp di kanan bawah.",
    },
    {
      q: "Apakah perawatan gigi di sini sakit?",
      a: "Setiap tindakan dimulai dari pemeriksaan dan penjelasan. Jika perlu anestesi, kami berikan sebelum tindakan dimulai, dan dosisnya disesuaikan agar Anda tetap nyaman.",
    },
    {
      q: "Berapa biaya perawatannya?",
      a: "Harga mulai tertera di halaman layanan sebagai gambaran. Biaya final ditetapkan setelah pemeriksaan karena kondisi gigi tiap orang berbeda — tidak ada biaya siluman.",
    },
    {
      q: "Anak saya 4 tahun, apakah bisa dirawat di sini?",
      a: "Bisa. Perawatan gigi anak didesain ramah: pemeriksaan diperkenalkan pelan-pelan supaya anak nyaman dan tidak trauma.",
    },
    {
      q: "Metode pembayaran apa saja yang diterima?",
      a: "Tunai, transfer bank, dan QRIS. (Catatan: sesuaikan dengan kebijakan klinik.)",
    },
  ];

  return (
    <section className="border-t border-ink/5 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <Kicker>Tanya jawab</Kicker>
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Pertanyaan yang sering muncul</h2>
        <div className="mt-8 divide-y divide-ink/8 border-y border-ink/8">
          {items.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink/10 text-ink-soft transition group-open:rotate-45">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————— Beranda: ajakan terakhir ————— */
export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 sm:pb-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-7 py-12 text-center shadow-lift sm:px-12">
        <div aria-hidden className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <h2 className="mx-auto max-w-lg text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Mulai dari konsultasi santai
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-brand-50/90 sm:text-base">
          Ceritakan keluhan Anda lewat WhatsApp — nanti kami bantu rekomendasikan perawatan yang paling tepat.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={waLink(waBookingMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-800 shadow-card transition hover:bg-brand-50"
          >
            Chat WhatsApp
          </a>
          <Link
            href="/layanan"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Cek Harga Layanan
          </Link>
        </div>
      </div>
    </section>
  );
}
