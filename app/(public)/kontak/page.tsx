import type { Metadata } from "next";
import { site, hours } from "@/lib/site";
import { waLink, waBookingMessage } from "@/lib/wa";
import { PhoneIcon, MapPinIcon, ClockIcon, ChatIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Kontak & Lokasi",
  description: "Alamat, jam praktik, dan cara menghubungi praktik drg Dava Fathiyatuzzakiyah.",
};

export default function KontakPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-600">Kontak</p>
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">Kunjungi praktik kami</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          Cara tercepat untuk menghubungi: WhatsApp. Untuk pertanyaan umum, telepon juga tersedia
          selama jam praktik.
        </p>
      </header>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <a
          href={waLink(waBookingMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-3xl border border-ink/8 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#25D366]/10 text-[#1ebe5d]">
            <ChatIcon width={22} height={22} />
          </span>
          <h2 className="mt-4 font-bold text-ink">WhatsApp</h2>
          <p className="mt-1 text-sm text-ink-soft">{site.phoneDisplay}</p>
          <p className="mt-3 text-sm font-semibold text-brand-700 group-hover:text-brand-800">
            Chat sekarang →
          </p>
        </a>

        <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <PhoneIcon width={22} height={22} />
          </span>
          <h2 className="mt-4 font-bold text-ink">Telepon</h2>
          <p className="mt-1 text-sm text-ink-soft">{site.phoneDisplay}</p>
          <p className="mt-3 text-xs text-ink-soft">Hanya berlaku selama jam praktik.</p>
        </div>

        <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <MapPinIcon width={22} height={22} />
          </span>
          <h2 className="mt-4 font-bold text-ink">Alamat</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{site.address}</p>
          <p className="mt-3 text-xs text-ink-soft">
            {/* TODO: ganti dengan alamat asli klinik, lalu aktifkan peta Google Maps di bawah. */}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <ClockIcon width={22} height={22} />
          </span>
          <h2 className="mt-4 font-bold text-ink">Jam Praktik</h2>
          <dl className="mt-3 divide-y divide-ink/5 text-sm">
            {hours.map((h) => (
              <div key={h.day} className="flex items-center justify-between py-2.5">
                <dt className="text-ink-soft">{h.day}</dt>
                <dd className={`font-semibold ${h.time === "Tutup" ? "text-red-500/80" : "text-ink"}`}>
                  {h.time}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Placeholder peta — ganti dengan embed Google Maps setelah alamat final */}
        <section className="grid min-h-64 place-items-center rounded-3xl border-2 border-dashed border-brand-300/70 bg-brand-50/40 p-6 text-center">
          <div>
            <MapPinIcon width={28} height={28} className="mx-auto text-brand-500" />
            <p className="mt-3 text-sm font-semibold text-ink">Peta lokasi menyusul</p>
            <p className="mt-1 text-xs text-ink-soft">
              Embed Google Maps akan aktif setelah alamat klinik final.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
