"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon, ToothIcon } from "./icons";
import { site } from "@/lib/site";
import { waLink, waBookingMessage } from "@/lib/wa";
import ClinicSelector from "@/components/ClinicSelector";
import { LanguageToggle, ThemeToggle, useSitePreferences } from "@/components/SitePreferences";

const links = [
  { href: "/", id: "nav.home", fallback: "Beranda" },
  { href: "/layanan", id: "nav.services", fallback: "Layanan" },
  { href: "/tentang", id: "nav.about", fallback: "Tentang" },
  { href: "/kontak", id: "nav.contact", fallback: "Kontak" },
  { href: "/galeri", id: "nav.gallery", fallback: "Galeri" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, clinicLocationId, language } = useSitePreferences();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const clinicName = clinicLocationId === "pekanbaru"
    ? "Pekanbaru"
    : clinicLocationId === "taluk-kuantan"
      ? "Taluk Kuantan"
      : null;
  const message = language === "en"
    ? "Hello, I would like to make an appointment with drg Dava Fathiyatuzzakiyah."
    : waBookingMessage;
  const whatsappHref = waLink(clinicName ? `${message}\n${language === "en" ? "Clinic" : "Lokasi"}: ${clinicName}` : message);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label={site.fullName} onClick={() => setOpen(false)}>
          <span className="nav-tooth grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white shadow-card">
            <ToothIcon width={20} height={20} />
          </span>
          <span className="leading-tight">
            <span className="block truncate text-[14px] font-bold tracking-tight text-ink sm:text-[15px]">{site.name}</span>
            <span className="block text-[10px] text-ink-soft sm:text-[11px]">{t("hero.kicker", "Praktik Kedokteran Gigi")}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label={t("nav.main", "Navigasi utama")}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-[13px] font-medium transition ${
                isActive(link.href)
                  ? "bg-brand-50 text-brand-800"
                  : "text-ink-soft hover:bg-brand-50/70 hover:text-ink"
              }`}
            >
              {t(link.id, link.fallback)}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex 2xl:hidden">
          <ClinicSelector />
          <LanguageToggle />
          <ThemeToggle />
          <Link href="/booking" className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-brand-700">
            {t("nav.booking", "Booking")}
          </Link>
        </div>

        <div className="hidden shrink-0 items-center gap-2 2xl:flex">
          <ClinicSelector />
          <LanguageToggle />
          <ThemeToggle />
          <Link href="/booking" className="rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:brightness-110">
            {t("nav.booking", "Booking")}
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-ink ring-1 ring-ink/10 xl:hidden"
          aria-expanded={open}
          aria-label={t(open ? "nav.closeMenu" : "nav.openMenu", open ? "Tutup menu" : "Buka menu")}
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon width={20} height={20} />
        </button>
      </div>

      {open && (
        <nav className="mobile-menu border-t border-ink/5 bg-cream px-5 py-4 xl:hidden" aria-label={t("nav.mobile", "Menu seluler")}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <ClinicSelector />
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block border-b border-ink/5 py-2.5 text-[15px] font-medium ${isActive(link.href) ? "text-brand-700" : "text-ink"}`}
                  onClick={() => setOpen(false)}
                >
                  {t(link.id, link.fallback)}
                </Link>
              </li>
            ))}
            <li className="pt-4 pb-2">
              <Link href="/booking" className="block rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 text-center text-sm font-semibold text-white" onClick={() => setOpen(false)}>
                {t("nav.bookingOnline", "Booking Online")}
              </Link>
            </li>
            <li>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="block rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-ink ring-1 ring-ink/10">
                {t("nav.chat", "Chat WhatsApp")}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
