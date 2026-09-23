"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import StaticTooth from "./StaticTooth";

// Canvas dimuat hanya di sisi klien (butuh WebGL)
const TeethCanvas = dynamic(() => import("./TeethCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <span className="text-sm text-brand-700 animate-pulse">Menyiapkan pengalaman 3D…</span>
    </div>
  ),
});

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

export default function TeethExperience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const dragRef = useRef({ yaw: 0, pitch: 0 });
  const draggingRef = useRef(false);
  const webglRef = useRef(true);
  const reducedRef = useRef(false);

  // Lapis teks yang opasitasnya di-update imperatif (tanpa re-render saat scroll)
  const l1 = useRef<HTMLDivElement>(null);
  const l2 = useRef<HTMLDivElement>(null);
  const l3 = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      webglRef.current = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglRef.current = false;
    }
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const apply = (p: number) => {
      const heroOut = 1 - smooth(clamp01((p - 0.05) / 0.16));
      if (l1.current) {
        l1.current.style.opacity = String(heroOut);
        l1.current.style.transform = `translateY(${-42 * smooth(clamp01((p - 0.05) / 0.22))}px)`;
        l1.current.style.pointerEvents = heroOut < 0.08 ? "none" : "auto";
      }
      const mid = smooth(clamp01((p - 0.47) / 0.13)) * (1 - smooth(clamp01((p - 0.76) / 0.1)));
      if (l2.current) {
        l2.current.style.opacity = String(mid);
        l2.current.style.transform = `translateY(${18 * (1 - mid)}px)`;
        l2.current.style.pointerEvents = "none";
      }
      const end = smooth(clamp01((p - 0.88) / 0.1));
      if (l3.current) {
        l3.current.style.opacity = String(end);
        l3.current.style.transform = `translateY(${24 * (1 - end)}px)`;
        l3.current.style.pointerEvents = end < 0.08 ? "none" : "auto";
      }
      const hintOut = 1 - smooth(clamp01((p - 0.015) / 0.06));
      if (hint.current) hint.current.style.opacity = String(hintOut);
    };

    const update = () => {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 1;
      progressRef.current = reducedRef.current ? 1 : p;
      apply(progressRef.current);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Drag = memutar gigi (horizontal untuk sentuhan agar scroll halaman tetap jalan)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const d = dragRef.current;
    d.yaw += (e.movementX || 0) * 0.006;
    if (e.pointerType !== "touch") {
      d.pitch = Math.max(-0.55, Math.min(0.55, d.pitch + (e.movementY || 0) * 0.004));
    }
  };
  const endDrag = () => {
    draggingRef.current = false;
  };

  return (
    <section ref={trackRef} aria-label="Pengalaman 3D senyum sehat" className="relative h-[320vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden select-none noise"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* Cahaya latar lembut — pusatnya di sisi kanan (panggung gigi 3D) */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(46%_52%_at_66%_38%,rgba(13,148,136,0.16),transparent_72%)]" />
        <div aria-hidden className="absolute -top-32 right-[-6%] h-[30rem] w-[30rem] rounded-full bg-brand-200/45 blur-3xl" />
        <div aria-hidden className="absolute bottom-[-12%] left-[-10%] h-[24rem] w-[24rem] rounded-full bg-sky-100/70 blur-3xl" />

        {webglRef.current ? (
          <TeethCanvas progressRef={progressRef} dragRef={dragRef} reducedRef={reducedRef} />
        ) : (
          <StaticTooth />
        )}

        {/* Lapisan teks — animasi masuk di div DALAM, wrapper murni inline-style */}
        <div
          ref={l1}
          data-layer="1"
          className="absolute inset-0 z-10 flex items-end sm:items-center"
        >
          <div className="hero-fade-in w-full px-6 pb-16 sm:pb-0 sm:pl-14 sm:pr-0">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-800 ring-1 ring-brand-200">
              Praktik Kedokteran Gigi
            </p>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.75rem]">
              Senyum sehat dimulai dari{" "}
              <span className="text-brand-600">detail kecil.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
              Perawatan gigi yang telaten dan tanpa rasa cemas — bersama drg Dava Fathiyatuzzakiyah.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/booking"
                className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-brand-700 active:translate-y-0 active:scale-[0.98]"
              >
                Booking Janji Temu
              </Link>
              <a
                href="/layanan"
                className="rounded-full bg-white/80 px-6 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10 backdrop-blur transition hover:-translate-y-0.5 hover:ring-brand-300 active:translate-y-0"
              >
                Lihat Layanan
              </a>
            </div>
            <p className="tabular mt-6 text-xs text-ink-soft">
              Senin–Jumat 09.00–17.00 · Sabtu 09.00–14.00 · <span className="text-ink font-medium">By appointment</span>
            </p>
          </div>
        </div>

        <div
          ref={l2}
          data-layer="2"
          className="absolute inset-x-0 bottom-[9vh] z-10 px-6 text-center opacity-0"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Ketelitian kami</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Dari satu gigi, ke senyum yang utuh</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft sm:text-base">
            Setiap gigi punya perannya. Kami rawat satu per satu dengan detail — hingga seluruh rahang kembali sehat.
          </p>
        </div>

        <div
          ref={l3}
          data-layer="3"
          className="absolute inset-x-0 bottom-[6vh] z-10 px-6 text-center opacity-0"
        >
          <div className="mx-auto max-w-lg rounded-3xl border border-brand-200/70 bg-white/85 p-7 shadow-lift backdrop-blur">
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">Siap wujudkan senyum sehat?</h2>
            <p className="mt-2 text-sm text-ink-soft sm:text-base">
              Janji temu cepat lewat WhatsApp — atau lihat dulu pilihan perawatannya.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/booking"
                className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lift transition hover:bg-brand-700"
              >
                Booking Online
              </Link>
              <a
                href="/kontak"
                className="rounded-full border border-ink/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-brand-400"
              >
                Lokasi &amp; Kontak
              </a>
            </div>
          </div>
        </div>

        {/* Petunjuk scroll */}
        <div
          ref={hint}
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-ink-soft"
          style={{ animation: "hint-bob 1.6s ease-in-out infinite" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
