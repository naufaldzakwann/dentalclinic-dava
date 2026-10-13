"use client";

import { useEffect } from "react";

const motionTargets =
  "header a, header button, main h1, main h2, main h3, main p, main article, main figure, main details, main form, main button, main a, main li, footer h2, footer p, footer a, footer li, .whatsapp-fab";

/** Adds lightweight, staggered entrance motion to public page content. */
export default function MotionDirector() {
  useEffect(() => {
    const root = document.body;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | undefined;
    const animate = (element: Element) => {
      if (!(element instanceof HTMLElement)) return;
      if (element.classList.contains("motion-ready")) return;

      const siblings = Array.from(element.parentElement?.children ?? []).filter((sibling) =>
        sibling.matches(motionTargets),
      );
      const index = Math.max(0, siblings.indexOf(element));
      element.style.setProperty("--motion-index", String(index));
      element.classList.add("motion-ready");

      if (!observer) {
        element.classList.add("motion-visible");
        return;
      }

      observer.observe(element);
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("motion-visible");
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
      );
    }

    const scan = (node: ParentNode) => {
      if (node instanceof Element && node.matches(motionTargets)) animate(node);
      node.querySelectorAll(motionTargets).forEach(animate);
    };

    scan(root);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        });
        record.removedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.classList.contains("motion-ready")) observer?.unobserve(node);
          node.querySelectorAll(".motion-ready").forEach((element) => observer?.unobserve(element));
        });
      });
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer?.disconnect();
    };
  }, []);

  return null;
}
