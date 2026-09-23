"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ToothIcon, MenuIcon } from "./icons";
import { site } from "@/lib/site";
import { waLink, waBookingMessage } from "@/lib/wa";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Layanan" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
  { href: "/galeri", label: "Galeri" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5" aria-label={site.fullName}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-white shadow-card">
            <ToothIcon width={20} height={20} />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold tracking-tight text-ink">{site.name}</span>
            <span className="block text-[11px] text-ink-soft">Praktik Kedokteran Gigi</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Utama">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                isActive(l.href)
                  ? "bg-brand-50 text-brand-800"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <a
          href={waLink(waBookingMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-brand-700 active:translate-y-0 active:scale-[0.98] md:inline-flex"
        >
          Booking
        </a>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink ring-1 ring-ink/10 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon width={20} height={20} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink/5 bg-cream px-5 py-3 md:hidden" aria-label="Menu seluler">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block border-b border-ink/5 py-2.5 text-[15px] font-medium ${
                    isActive(l.href) ? "text-brand-700" : "text-ink"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 pb-1">
              <a
                href={waLink(waBookingMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full bg-brand-600 px-5 py-2.5 text-center text-sm font-semibold text-white"
              >
                Booking Janji Temu
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
