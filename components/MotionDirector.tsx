"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { setupCardMotion } from "./card-motion";
import { useSitePreferences } from "./SitePreferences";

gsap.registerPlugin(ScrollTrigger);

const allowMotion = "(prefers-reduced-motion: no-preference)";

export default function MotionDirector() {
  const pathname = usePathname();
  const { language, ready } = useSitePreferences();

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(allowMotion, () => {
      const lenis = new Lenis({
        lerp: 0.12,
        stopInertiaOnNavigate: true,
        prevent: (node) => node instanceof HTMLTextAreaElement && node.scrollHeight > node.clientHeight,
      });
      const tick = (seconds: number) => lenis.raf(seconds * 1000);
      const releaseAnchorScroll = (event: MouseEvent) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!(event.target instanceof Element)) return;

        const link = event.target.closest<HTMLAnchorElement>("a[href]");
        if (!link?.hash || link.target || link.origin !== location.origin || link.pathname !== location.pathname) return;

        // Let the browser or Next.js handle the fragment after wheel easing stops.
        lenis.scrollTo(lenis.actualScroll, { immediate: true });
      };
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.addEventListener("click", releaseAnchorScroll, true);

      return () => {
        document.removeEventListener("click", releaseAnchorScroll, true);
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });

    return () => media.revert();
  }, []);

  useEffect(() => {
    const main = document.getElementById("konten-utama");
    if (!main) return;

    const media = gsap.matchMedia();
    media.add(allowMotion, () => setupCardMotion(main));
    return () => media.revert();
  }, [pathname]);

  useEffect(() => {
    if (!ready) return;
    const main = document.getElementById("konten-utama");
    if (!main) return;

    const media = gsap.matchMedia();
    media.add(allowMotion, () => {
      main.querySelectorAll("h1, h2").forEach((heading) => {
        const words = heading.querySelectorAll("[data-heading-word]");
        if (!words.length) return;

        gsap.from(words, {
          opacity: 0,
          yPercent: 40,
          duration: 0.55,
          stagger: 0.065,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 90%",
            once: true,
            fastScrollEnd: true,
          },
        });
      });
      ScrollTrigger.refresh(true);
    });

    return () => media.revert();
  }, [language, pathname, ready]);

  return null;
}
