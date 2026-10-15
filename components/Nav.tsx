"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, MenuIcon, ToothIcon } from "./icons";
import { LanguageToggle, ThemeToggle, useSitePreferences } from "./SitePreferences";

const links = [
  { href: "/", id: "nav.home", label: "Beranda" },
  { href: "/layanan", id: "nav.services", label: "Perawatan" },
  { href: "/tentang", id: "nav.about", label: "Tentang kami" },
  { href: "/galeri", id: "nav.gallery", label: "Galeri" },
  { href: "/kontak", id: "nav.contact", label: "Kontak" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, language } = useSitePreferences();
  const toggle = useRef<HTMLButtonElement>(null);
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className="site-header">
      <div className="page-shell nav-inner">
        <Link href="/" className="brand-lockup" aria-label="Dava Dental Care · drg. Dava Fathiyatuzzakiyah, Sp.KG." onClick={() => setOpen(false)}>
          <span className="brand-symbol"><ToothIcon width={27} height={27} aria-hidden /></span>
          <span><span className="brand-name">dava<span>.</span></span><span className="brand-caption">DENTAL CARE</span></span>
        </Link>
        <nav className="desktop-nav" aria-label={t("nav.main", "Navigasi utama")}>
          {links.map((link) => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined}>{t(link.id, link.label)}</Link>)}
        </nav>
        <div className="nav-actions">
          <div className="nav-language"><LanguageToggle /></div>
          <div className="nav-theme"><ThemeToggle /></div>
          <Link className="btn-primary nav-book" href="/booking">{language === "en" ? "Book a visit" : "Buat janji"}<ArrowRightIcon width={16} height={16} aria-hidden /></Link>
          <button ref={toggle} type="button" className="mobile-toggle" aria-controls="mobile-navigation" aria-expanded={open} aria-label={t(open ? "nav.closeMenu" : "nav.openMenu", open ? "Tutup menu" : "Buka menu")} onClick={() => setOpen(!open)}>
            {open ? <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="m6 6 12 12M6 18 18 6" /></svg> : <MenuIcon width={22} height={22} aria-hidden />}
          </button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-navigation page-shell" aria-label={t("nav.mobile", "Menu seluler")}>
        {links.map((link) => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined} onClick={() => setOpen(false)}>{t(link.id, link.label)}<ArrowRightIcon width={17} height={17} aria-hidden /></Link>)}
        <div className="flex items-center justify-between gap-4 py-5"><LanguageToggle /><ThemeToggle /><Link className="btn-primary" href="/booking" onClick={() => setOpen(false)}>{t("nav.booking", "Buat janji")}</Link></div>
      </nav>}
    </header>
  );
}
