"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import StaticTooth from "./StaticTooth";
import { useSitePreferences } from "@/components/SitePreferences";
import ClinicSelector from "@/components/ClinicSelector";

const TeethCanvas = dynamic(() => import("./TeethCanvas"), {
  ssr: false,
  loading: () => <StaticTooth />,
});

export default function TeethExperience() {
  const { t, language } = useSitePreferences();
  const [webglAvailable, setWebglAvailable] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactLayout, setCompactLayout] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebglAvailable(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebglAvailable(false);
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const compactQuery = window.matchMedia("(max-width: 767px)");
    setCompactLayout(compactQuery.matches);
    const updateMotionPreference = () => setReducedMotion(motionQuery.matches);
    motionQuery.addEventListener("change", updateMotionPreference);
    const updateLayoutPreference = () => setCompactLayout(compactQuery.matches);
    compactQuery.addEventListener("change", updateLayoutPreference);
    return () => {
      motionQuery.removeEventListener("change", updateMotionPreference);
      compactQuery.removeEventListener("change", updateLayoutPreference);
    };
  }, []);

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-cream">
      <div aria-hidden className="hero-wash absolute inset-0" />
      <div aria-hidden className="ambient-orb ambient-orb-a absolute -right-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-brand-200/55 blur-3xl" />
      <div aria-hidden className="ambient-orb ambient-orb-b absolute -bottom-60 left-[28%] h-[34rem] w-[34rem] rounded-full bg-accent-200/40 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-3 px-5 pb-8 pt-10 sm:px-8 md:grid-cols-[0.92fr_1.08fr] md:gap-0 md:py-12">
        <div className="relative z-10 max-w-xl md:py-12">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.17em] text-brand-800 shadow-sm backdrop-blur">
            <span aria-hidden className="h-2 w-2 rounded-full bg-brand-500" />
            {t("hero.kicker", "Praktik Kedokteran Gigi")}
          </p>
          <h1 id="hero-title" className="max-w-[15ch] text-[2.65rem] font-extrabold leading-[1.04] tracking-[-0.055em] text-ink sm:text-5xl lg:text-[4.1rem]">
            {t("hero.title", "Gigi yang sehat merupakan cerminan hidup sehat.")}
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-7 text-ink-soft sm:text-lg sm:leading-8">
            {t("hero.description", "Perawatan gigi yang telaten dan nyaman bersama drg Dava Fathiyatuzzakiyah. Setiap langkah dijelaskan dengan tenang, agar Anda tahu apa yang akan dilakukan.")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/booking"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white shadow-lift transition duration-200 hover:-translate-y-0.5 hover:bg-brand-800 active:translate-y-0 active:scale-[0.98]"
            >
              {t("hero.book", "Buat Janji Temu")}
            </Link>
            <Link
              href="/layanan"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-200 bg-white/80 px-6 py-3 text-sm font-bold text-brand-800 transition duration-200 hover:border-brand-400 hover:bg-white"
            >
              {t("hero.explore", "Jelajahi Perawatan")}
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-brand-800">{t("location.heroPrompt", "Pilih lokasi klinik")}</span>
            <ClinicSelector />
          </div>

          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-ink-soft">
            <p className="inline-flex items-center gap-2">
              <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-brand-100 text-brand-800">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="m3.4 8.2 2.8 2.7 6.4-6.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              {t("hero.clear", "Penjelasan yang jelas")}
            </p>
            <p className="inline-flex items-center gap-2">
              <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-brand-100 text-brand-800">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="m3.4 8.2 2.8 2.7 6.4-6.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              {t("hero.scheduled", "Janji temu terjadwal")}
            </p>
          </div>
        </div>

        <div className="relative -mx-5 h-[40svh] min-h-72 sm:-mx-8 sm:h-[54svh] md:mx-0 md:h-[min(78svh,700px)] md:min-h-[31rem]">
          <div aria-hidden className="tooth-stage absolute inset-0 overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem]">
            <div className="absolute inset-[8%] rounded-full border border-white/70" />
            <div className="absolute inset-[16%] rounded-full border border-brand-200/45" />
            <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-200/50 blur-3xl" />
          </div>

          <div className="absolute inset-0">
            {webglAvailable ? <TeethCanvas reducedMotion={reducedMotion} compact={compactLayout} /> : <StaticTooth />}
          </div>

          <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-4 py-2.5 text-xs font-semibold text-brand-900 shadow-card backdrop-blur sm:bottom-8">
            <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-brand-100 text-brand-700">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M10 2.5v3M10 14.5v3M2.5 10h3m9 0h3M4.7 4.7l2.1 2.1m6.4 6.4 2.1 2.1m0-10.6-2.1 2.1m-6.4 6.4-2.1 2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </span>
            <span>
              <span className="block">{t("hero.model", "Model gigi anatomi 3D")}</span>
              <span className="mt-0.5 block text-[10px] font-medium text-ink-soft">{t("hero.drag", "Seret untuk putar · klik kanan / dua jari untuk geser")}</span>
            </span>
          </div>
          <p className="sr-only">{language === "en" ? "3D molar with natural enamel and violet lighting." : "Gigi geraham 3D dengan permukaan enamel alami dan pencahayaan violet."}</p>
        </div>
      </div>
    </section>
  );
}
