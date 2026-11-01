"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, MenuIcon, ToothIcon } from "./icons";
import { LanguageToggle, ThemeToggle, useSitePreferences } from "./SitePreferences";
import WhatsAppIcon from "./WhatsAppIcon";
import styles from "./Navigation.module.css";

const links = [
  { href: "/", id: "Beranda", en: "Home" },
  { href: "/layanan", id: "Perawatan", en: "Treatments" },
  { href: "/tentang", id: "Dokter", en: "Dentist" },
  { href: "/kontak", id: "Lokasi", en: "Locations" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, language } = useSitePreferences();
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const english = language === "en";
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    const closeOutside = (event: PointerEvent | FocusEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    window.addEventListener("keydown", closeWithEscape);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeWithEscape);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return <header ref={header} className={`site-header ${styles.header}`}>
    <div className={`page-shell nav-inner ${styles.inner}`}>
      <Link href="/" className={styles.brand} aria-label="Dava Dental Care" onClick={() => setOpen(false)}>
        <span className={styles.brandMark}><ToothIcon width={25} height={25} aria-hidden="true" /></span>
        <span><span className={styles.brandName}>dava<span>.</span></span><span className={styles.brandCaption}>DENTAL CARE</span></span>
      </Link>
      <nav className={`desktop-nav ${styles.desktopLinks}`} aria-label={t("nav.main", "Navigasi utama")}>
        {links.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined}>{english ? link.en : link.id}</Link>)}
      </nav>
      <div className={`nav-actions ${styles.actions}`}>
        <div className={`nav-language ${styles.languageDesktop}`}><LanguageToggle /></div>
        <div className={`nav-theme ${styles.themeDesktop}`}><ThemeToggle /></div>
        <Link className={`nav-book ${styles.book}`} href="/booking" onClick={() => setOpen(false)}>
          <WhatsAppIcon width={17} height={17} aria-hidden="true" />
          <span>{english ? "Book a visit" : "Buat janji"}</span>
        </Link>
        <button
          ref={toggle}
          type="button"
          className={`mobile-toggle ${styles.toggle}`}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={t(open ? "nav.closeMenu" : "nav.openMenu", open ? "Tutup menu" : "Buka menu")}
          onClick={() => setOpen(!open)}
        >
          {open ? <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg> : <MenuIcon width={21} height={21} aria-hidden="true" />}
        </button>
      </div>
    </div>
    {open && <nav ref={menu} id="mobile-navigation" className={`mobile-navigation ${styles.mobilePanel}`} aria-label={t("nav.mobile", "Menu seluler")}>
      <div className={`page-shell ${styles.mobileInner}`}>
        <div className={styles.mobileLinks}>
          {links.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined} onClick={() => setOpen(false)}>
            {english ? link.en : link.id}<ArrowRightIcon width={19} height={19} aria-hidden="true" />
          </Link>)}
        </div>
        <div className={styles.menuPreferences}>
          <span>{english ? "Make yourself at home." : "Selamat datang di Dava."}</span>
          <div><LanguageToggle /><ThemeToggle /></div>
        </div>
        <div className={styles.menuClinics}><span>Pekanbaru</span><span>Taluk Kuantan</span></div>
      </div>
    </nav>}
  </header>;
}
