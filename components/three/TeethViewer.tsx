"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useSitePreferences } from "@/components/SitePreferences";
import StaticTooth from "./StaticTooth";

const TeethCanvas = dynamic(() => import("./TeethCanvas"), { ssr: false });

class ViewerBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

type TeethViewerProps = {
  progress?: number;
  onReady?: () => void;
  onLoadProgress?: (value: number) => void;
};

export default function TeethViewer({ progress = 0, onReady, onLoadProgress }: TeethViewerProps) {
  const { language } = useSitePreferences();
  const english = language === "en";
  const root = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReady, onLoadProgress });
  const notified = useRef(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [playing, setPlaying] = useState(true);
  const hasModel = available === true && !failed;
  const rotating = playing && !reducedMotion;

  useEffect(() => { callbacks.current = { onReady, onLoadProgress }; }, [onLoadProgress, onReady]);
  const reportProgress = useCallback((value: number) => callbacks.current.onLoadProgress?.(Math.max(0, Math.min(100, value))), []);
  const markReady = useCallback(() => {
    setLoaded(true);
    callbacks.current.onLoadProgress?.(100);
    if (!notified.current) {
      notified.current = true;
      callbacks.current.onReady?.();
    }
  }, []);
  const markFailed = useCallback(() => { setFailed(true); markReady(); }, [markReady]);

  useEffect(() => {
    let supported = false;
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      supported = Boolean(context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { /* Resolve the intro with a static visual if WebGL is restricted. */ }
    setAvailable(supported);
    if (!supported) markReady();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
    const updateVisibility = () => setDocumentVisible(document.visibilityState === "visible");
    updateMotion();
    updateVisibility();
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px" });
    if (root.current) observer.observe(root.current);
    return () => {
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, [markReady]);

  useEffect(() => {
    if (!hasModel || loaded) return;
    const timer = window.setTimeout(markFailed, 20000);
    return () => window.clearTimeout(timer);
  }, [hasModel, loaded, markFailed]);

  return <div ref={root} className="dental-viewer relative isolate h-full min-h-0 w-full" role="group" aria-label={english ? "3D visual" : "Visual 3D"}>
    {(!loaded || !hasModel) && <StaticTooth />}
    {hasModel && <ViewerBoundary fallback={<StaticTooth />} onError={markFailed}>
      <div className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${loaded ? "opacity-100" : "opacity-0"}`}>
        <TeethCanvas reducedMotion={reducedMotion} progress={Math.max(0, Math.min(1, progress))} autoRotate={playing && (progress < 0.1 || progress > 0.88)} active={visible && documentVisible} onReady={markReady} onLoadProgress={reportProgress} onError={markFailed} label={english ? "Rotating 3D visual" : "Visual 3D berputar"} />
      </div>
    </ViewerBoundary>}
    {hasModel && loaded && <button
      type="button"
      aria-label={rotating ? (english ? "Pause animation" : "Jeda animasi") : (english ? "Play animation" : "Putar animasi")}
      aria-pressed={!rotating}
      title={rotating ? (english ? "Pause animation" : "Jeda animasi") : (english ? "Play animation" : "Putar animasi")}
      onClick={() => { setReducedMotion(false); setPlaying(!rotating); }}
      className="absolute bottom-5 right-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/35 text-brand-800/70 backdrop-blur-md transition hover:bg-white/70 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 sm:bottom-8 sm:right-8"
    >
      <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden="true">{rotating ? <path d="M7 4v12M13 4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="m7 4 9 6-9 6V4Z" fill="currentColor" />}</svg>
    </button>}
  </div>;
}
