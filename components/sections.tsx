import Link from "next/link";
import { services, featuredSlugs, rupiah } from "@/lib/site";
import { ArrowRightIcon, ToothIcon, StarIcon, SmileIcon } from "./icons";
import { waLink, waBookingMessage } from "@/lib/wa";
import { serviceIcons } from "./service-icons";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
      <span aria-hidden className="h-px w-8 bg-brand-400" />
      {children}
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-400" />
    </p>
  );
}

/* ————— Beranda: layanan unggulan ————— */
export function ServicesPreview() {
  const featured = featuredSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter(Boolean) as typeof services;
  const [first, ...rest] = featured;

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28" id="layanan">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-lg">
          <Kicker>Layanan</Kicker>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Kartu utama: lebih besar, menonjol */}
        <a
          href={`/layanan#${first.slug}`}
          className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-800 via-brand-600 to-brand-400 p-8 shadow-lift transition hover:-translate-y-1 md:row-span-2"
        >
          <div aria-hidden className="glow-drift absolute -right-14 -top-14 h-44 w-44 rounded-full bg-accent-300/30 blur-2xl" />
          <div aria-hidden className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <span className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white">
            <ToothIcon width={24} height={24} />
          </span>
          <h3 className="mt-auto text-2xl font-bold text-white">{first.name}</h3>
          <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-brand-50/85">{first.short}</p>
          <p className="tabular mt-6 text-sm font-semibold text-white">
            Mulai <span className="text-lg">{rupiah(first.priceFrom ?? 0)}</span>
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-100">
            Detail perawatan
            <ArrowRightIcon width={16} height={16} className="transition group-hover:translate-x-1" />
          </span>
        </a>

        {rest.map((s) => {
          const Icon = serviceIcons[s.slug] ?? ToothIcon;
          return (
            <a
              key={s.slug}
              href={`/layanan#${s.slug}`}
              className="group flex flex-col rounded-[1.75rem] bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="mb-6 grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon width={22} height={22} />
              </span>
              <h3 className="text-lg font-bold text-ink">{s.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.short}</p>
              <p className="tabular mt-auto pt-5 text-sm text-ink-soft">
                Mulai <span className="font-semibold text-ink">{rupiah(s.priceFrom ?? 0)}</span>
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}

/* ————— Beranda: keunggulan ————— */
const whyUs = [
  {
    title: "Penjelasan sebelum tindakan",
    text: "Kondisi gigi, opsi perawatan, dan estimasi biaya dibahas dulu — baru mulai saat Anda siap. Tidak ada kejutan di tengah proses.",
  },
  {
    title: "Sterilisasi standar klinik",
    text: "Instrumen melalui sterilisasi bertahap dan terdokumentasi; sekali pakai untuk yang disposabel.",
  },
  {
    title: "Tanpa biaya tersembunyi",
    text: "Harga mulai tertera jelas; biaya final disepakati setelah pemeriksaan, bukan saat pembayaran.",
  },
  {
    title: "Ramah semua usia",
    text: "Dari gigi susu hingga gigi tiruan — pendekatan dan tempo perawatan menyesuaikan siapa yang duduk di kursi.",
  },
] as const;

export function WhyUs() {
  return (
    <section className="border-y border-ink/5 bg-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Kicker>Mengapa ke sini</Kicker>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Nyaman itu bagian dari perawatan
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Empat hal yang saya pegang di setiap pasien — dari yang pertama kali ke dokter gigi
            sampai yang sudah rutin bertahun-tahun.
          </p>
        </div>

        <ol className="divide-y divide-ink/8 border-t border-ink/8">
          {whyUs.map((w, i) => (
            <li key={w.title} className="flex items-start gap-6 py-7">
              <span className="tabular text-sm font-semibold text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-bold text-ink">{w.title}</h3>
                <p className="mt-1.5 max-w-[52ch] text-sm leading-relaxed text-ink-soft">{w.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ————— Beranda: testimoni ————— */
export function Testimonials() {
  const [featuredQuote, ...supporting] = [
    {
      name: "Bayu P.",
      tag: "Perawatan saluran akar",
      text: "Pernah takut ke dokter gigi bertahun-tahun. Di sini sabar banget, langkahnya dijelaskan satu per satu — sekarang malah rutin kontrol.",
    },
    {
      name: "Sari W.",
      tag: "Scaling",
      text: "Penjelasannya detail banget sebelum mulai, jadi nggak cemas. Scaling-nya nggak sakit sama sekali, rutenya enak.",
    },
    {
      name: "Nadia & Ayra",
      tag: "Gigi anak",
      text: "Anak saya yang tadinya nangis di klinik lain, di sini malah betah. Tambal gigi susunya beres tanpa drama.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <Kicker>Kata pasien</Kicker>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <figure className="flex flex-col justify-between rounded-[1.75rem] bg-gradient-to-br from-ink to-brand-900 p-8 text-white shadow-lift sm:p-10">
          <blockquote className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
            &ldquo;{featuredQuote.text}&rdquo;
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 font-bold text-white">
              B
            </span>
            <span>
              <span className="block font-bold text-white">{featuredQuote.name}</span>
              <span className="block text-sm text-white/60">{featuredQuote.tag}</span>
            </span>
          </figcaption>
        </figure>

        <div className="grid gap-4">
          {supporting.map((t) => (
            <figure key={t.name} className="rounded-[1.75rem] bg-white p-6 shadow-card">
              <div className="flex gap-0.5 text-accent-500" aria-label="Rating 5 dari 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-ink">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-bold text-ink">{t.name}</span>
                <span className="text-ink-soft"> · {t.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
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
    <section className="border-y border-ink/5 bg-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Kicker>Tanya jawab</Kicker>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Pertanyaan yang sering muncul
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Belum menemukan jawabannya?{" "}
            <a
              href={waLink("Halo, saya ingin bertanya seputar perawatan gigi.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-800"
            >
              Tanya langsung via WhatsApp
            </a>
            .
          </p>
        </div>

        <div className="divide-y divide-ink/8 border-y border-ink/8">
          {items.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-ink-soft ring-1 ring-ink/10 transition group-open:rotate-45 group-open:text-brand-700">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-ink-soft">{f.a}</p>
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
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-4 sm:pb-28">
      <div className="noise relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-ink via-[#0d2f39] to-brand-900 px-7 py-14 text-left shadow-lift sm:px-14">
        <div aria-hidden className="glow-drift absolute -right-20 -top-28 h-72 w-72 rounded-full bg-brand-400/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-accent-400/15 blur-3xl" />
        <div className="relative">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
            <SmileIcon width={18} height={18} /> Mulai dari konsultasi santai
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ceritakan keluhan Anda, kami bantu urus sisanya
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/60">
            Buat janji temu online dalam 3 langkah, atau ceritakan keluhan Anda lewat WhatsApp —
            kami bantu rekomendasikan perawatan yang paling tepat.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/booking"
              className="rounded-full bg-gradient-to-r from-accent-400 to-accent-500 px-6 py-3 text-sm font-bold text-ink shadow-card transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
            >
              Booking Online
            </Link>
            <a
              href={waLink(waBookingMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-6 py-3 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              Lebih suka WhatsApp? Chat →
            </a>
            <Link
              href="/layanan"
              className="rounded-full px-6 py-3 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              Cek harga layanan →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
