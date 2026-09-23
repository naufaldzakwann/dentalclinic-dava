import Link from "next/link";
import { site } from "@/lib/site";
import { ToothIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-500 text-white">
              <ToothIcon width={20} height={20} />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold text-white">{site.name}</span>
              <span className="block text-[11px] text-white/60">Praktik Kedokteran Gigi</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Perawatan gigi yang telaten, jujur soal biaya, dan nyaman untuk semua usia.
          </p>
        </div>

        <nav aria-label="Tautan footer">
          <h2 className="mb-4 text-sm font-semibold text-white">Tautan</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="transition hover:text-white" href="/">Beranda</Link></li>
            <li><Link className="transition hover:text-white" href="/layanan">Layanan &amp; Harga</Link></li>
            <li><Link className="transition hover:text-white" href="/tentang">Tentang drg Dava</Link></li>
            <li><Link className="transition hover:text-white" href="/kontak">Kontak</Link></li>
            <li><Link className="transition hover:text-white" href="/galeri">Galeri</Link></li>
            <li><Link className="transition hover:text-white" href="/booking">Booking Online</Link></li>
            <li><Link className="transition hover:text-white" href="/kebijakan-privasi">Kebijakan Privasi</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">Jam Praktik</h2>
          <ul className="space-y-2.5 text-sm">
            <li className="flex justify-between gap-4"><span>Senin – Jumat</span><span className="text-white">09.00 – 17.00</span></li>
            <li className="flex justify-between gap-4"><span>Sabtu</span><span className="text-white">09.00 – 14.00</span></li>
            <li className="flex justify-between gap-4"><span>Minggu</span><span className="text-white/50">Tutup</span></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">Hubungi Kami</h2>
          <ul className="space-y-2.5 text-sm">
            <li>{site.phoneDisplay}</li>
            <li className="break-words">{site.address}</li>
            <li>
              <a className="transition hover:text-white" href={site.instagram} target="_blank" rel="noopener noreferrer">
                Instagram @drgdava
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {site.fullName}. Seluruh hak cipta dilindungi.</p>
          <p>
            Model 3D &ldquo;Teeth&rdquo; oleh Poly by Google, lisensi{" "}
            <a
              className="underline decoration-white/30 underline-offset-2 hover:text-white/70"
              href="https://poly.pizza/m/eNR_DPPP1Hp"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY
            </a>{" "}
            via Poly Pizza.
          </p>
        </div>
      </div>
    </footer>
  );
}
