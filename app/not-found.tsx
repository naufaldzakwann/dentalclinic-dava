import Link from "next/link";
import { ToothIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-cream px-6 text-center">
      <div>
        <span className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl bg-brand-600 text-white shadow-card">
          <ToothIcon width={30} height={30} />
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">404 — tidak ditemukan</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Halaman ini gosong kayanya
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
          Halaman yang Anda cari tidak ada atau sudah dipindah. Mari kembali ke halaman utama.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/layanan"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10 transition hover:ring-brand-300"
          >
            Lihat Layanan
          </Link>
        </div>
      </div>
    </main>
  );
}
