"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ToothIcon } from "@/components/icons";
import { useSitePreferences } from "@/components/SitePreferences";
import TeethViewer from "./TeethViewer";

export default function TeethExperience() {
  const { language } = useSitePreferences();
  const english = language === "en";
  const track = useRef<HTMLElement>(null);
  const started = useRef(0);
  const displayProgressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [assetProgress, setAssetProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);
  const markReady = useCallback(() => { setAssetProgress(100); setReady(true); }, []);
  const updateAssetProgress = useCallback((value: number) => setAssetProgress(Math.min(100, Math.max(0, value))), []);

  useEffect(() => {
    started.current = performance.now();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
    updateMotion();
    motion.addEventListener("change", updateMotion);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { motion.removeEventListener("change", updateMotion); document.body.style.overflow = previousOverflow; delete document.body.dataset.intro; };
  }, []);

  useEffect(() => {
    if (!ready || displayProgress < 100) return;
    const remaining = Math.max(350, 1500 - (performance.now() - started.current));
    const welcomeTimer = window.setTimeout(() => setWelcome(true), remaining);
    const reveal = window.setTimeout(() => setExiting(true), remaining + 1200);
    const complete = window.setTimeout(() => { setLoading(false); document.body.style.overflow = ""; }, remaining + 1850);
    return () => { clearTimeout(welcomeTimer); clearTimeout(reveal); clearTimeout(complete); };
  }, [displayProgress, ready]);

  useEffect(() => {
    if (!loading) return;
    const content = [
      ...document.querySelectorAll<HTMLElement>("body > header, .site-header, .site-footer, .whatsapp-fab, .skip-link"),
      ...Array.from(document.querySelector("#konten-utama")?.children ?? []).filter((node): node is HTMLElement => node instanceof HTMLElement && !node.classList.contains("clinic-loader")),
    ];
    const original = content.map((element) => ({ element, inert: element.inert }));
    content.forEach((element) => { element.inert = true; });
    return () => { original.forEach(({ element, inert }) => { element.inert = inert; }); };
  }, [loading]);

  useEffect(() => {
    let animation = 0;
    const target = ready ? 100 : Math.min(98, assetProgress);
    const animate = () => {
      const next = displayProgressRef.current + (target - displayProgressRef.current) * 0.12;
      displayProgressRef.current = Math.abs(target - next) < 0.1 ? target : next;
      setDisplayProgress(displayProgressRef.current);
      if (Math.abs(target - displayProgressRef.current) > 0.1) animation = requestAnimationFrame(animate);
    };
    animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, [assetProgress, ready]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!track.current) return;
      const bounds = track.current.getBoundingClientRect();
      const distance = Math.max(1, bounds.height - window.innerHeight);
      setProgress(Math.max(0, Math.min(1, -bounds.top / distance)));
      document.body.dataset.intro = bounds.bottom > window.innerHeight * 0.4 ? "active" : "complete";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  return <>
    {loading && <div className={`clinic-loader ${welcome ? "loader-is-welcome" : ""} ${exiting ? "loader-exiting" : ""}`} role="status" aria-live="polite" aria-label={english ? "Preparing the dental experience" : "Menyiapkan tampilan klinik"}>
      <div className="loader-top"><span className="loader-brand">dava<span>.</span></span><span className="loader-spark" aria-hidden><i /><i /><i /><i /></span></div>
      <div className="loader-marquee" aria-hidden><div><span>CARE FOR YOUR SMILE <i>✦</i> </span><span>CARE FOR YOUR SMILE <i>✦</i> </span></div></div>
      {welcome ? <div className="loader-welcome"><span>WELCOME<span>.</span></span><p>{english ? "Your smile deserves a little care." : "Senyum Anda, perhatian kami."}</p></div> : <div className="loader-pill"><span className="loader-tooth"><ToothIcon width={26} height={26} aria-hidden /></span><span>{english ? "PREPARING YOUR SMILE" : "MENYIAPKAN SENYUM ANDA"}</span><span className="loader-percentage">{Math.round(displayProgress)}<small>%</small></span></div>}
      <div className="loader-bottom"><span>DENTAL CARE, WITH A PERSONAL TOUCH.</span><span>{english ? "A little care. A confident smile." : "Penuh perhatian. Untuk senyum Anda."}</span></div>
      <span className="sr-only">{english ? "Loading 3D assets" : "Memuat aset 3D"}: {Math.round(assetProgress)}%</span>
    </div>}
    <noscript><style>{`.clinic-loader,.intro-track{display:none!important}`}</style></noscript>
    <section ref={track} className={`intro-track ${reducedMotion ? "intro-reduced" : ""}`} aria-label={english ? "A visual introduction to Dava Dental Care" : "Pembukaan visual Dava Dental Care"}>
      <div className="intro-sticky">
        <div className="intro-glow" aria-hidden /><div className="intro-orbit intro-orbit-a" aria-hidden /><div className="intro-orbit intro-orbit-b" aria-hidden />
        <div className="intro-stage"><TeethViewer progress={reducedMotion ? 1 : progress} onReady={markReady} onLoadProgress={updateAssetProgress} /></div>
        <a href="#welcome" className="intro-scroll" aria-label={english ? "Continue to the clinic" : "Lanjut ke informasi klinik"}><svg width="18" height="25" viewBox="0 0 18 25" fill="none" aria-hidden><path d="M9 2v20m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
        <div className="intro-progress" aria-hidden><span style={{ height: `${Math.max(7, progress * 100)}%` }} /></div>
      </div>
    </section>
  </>;
}
