import Link from "next/link";
import { site } from "@/lib/site";
import { ToothIcon } from "./icons";
import { T } from "@/components/SitePreferences";
import { clinicLocations } from "@/lib/site";

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
            <T id="site.tagline" fallback={site.tagline} />.
          </p>
        </div>

        <nav aria-label="Tautan footer">
          <h2 className="mb-4 text-sm font-semibold text-white"><T id="footer.links" fallback="Tautan" /></h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="transition hover:text-white" href="/"><T id="nav.home" fallback="Beranda" /></Link></li>
            <li><Link className="transition hover:text-white" href="/layanan"><T id="nav.services" fallback="Layanan Perawatan" /></Link></li>
            <li><Link className="transition hover:text-white" href="/tentang"><T id="nav.about" fallback="Tentang drg Dava" /></Link></li>
            <li><Link className="transition hover:text-white" href="/kontak"><T id="nav.contact" fallback="Kontak" /></Link></li>
            <li><Link className="transition hover:text-white" href="/galeri"><T id="nav.gallery" fallback="Galeri" /></Link></li>
            <li><Link className="transition hover:text-white" href="/booking"><T id="nav.bookingOnline" fallback="Booking Online" /></Link></li>
            <li><Link className="transition hover:text-white" href="/kebijakan-privasi"><T id="privacy.title" fallback="Kebijakan Privasi" /></Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-white"><T id="footer.hours" fallback="Jam Praktik" /></h2>
          <ul className="space-y-2.5 text-sm">
            <li className="flex justify-between gap-4"><span><T id="footer.weekdays" fallback="Senin – Jumat" /></span><span className="text-white">09.00 – 17.00</span></li>
            <li className="flex justify-between gap-4"><span><T id="footer.saturday" fallback="Sabtu" /></span><span className="text-white">09.00 – 14.00</span></li>
            <li className="flex justify-between gap-4"><span><T id="footer.sunday" fallback="Minggu" /></span><span className="text-white/50"><T id="footer.closed" fallback="Tutup" /></span></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-white"><T id="footer.contact" fallback="Hubungi Kami" /></h2>
          <ul className="space-y-2.5 text-sm">
            <li>{site.phoneDisplay}</li>
            {clinicLocations.map((location) => (
              <li key={location.id} className="text-white/55">{location.city}, {location.region}</li>
            ))}
            <li>
              <a className="transition hover:text-white" href={site.instagram} target="_blank" rel="noopener noreferrer">
                <T id="footer.instagram" fallback="Instagram @drgdava" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {site.fullName}. <T id="footer.rights" fallback="Seluruh hak cipta dilindungi." /></p>
          <p>
            <T id="footer.license" fallback="Model 3D gigi berdasarkan “Human mouth detailed” oleh Mince, lisensi" />{" "}
            <a
              className="underline decoration-white/30 underline-offset-2 hover:text-white/70"
              href="https://commons.wikimedia.org/wiki/File:3D_model_of_the_human_mouth.stl"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 4.0
            </a>{" "}<T id="footer.licenseEnd" fallback="— dipisah & disusun ulang per gigi." />
          </p>
        </div>
      </div>
    </footer>
  );
}
