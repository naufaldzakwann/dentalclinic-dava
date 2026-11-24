import { animate, hover, inView, scopeMotion } from "motion";

export function setupCardMotion(root: HTMLElement): () => void {
  const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-motion-card]"));

  const scope = scopeMotion(root, () => {
    if ("IntersectionObserver" in window) {
      inView(cards, (card) => {
        if (card.matches(":focus-within")) return;

        // Use the CSS translate property so the entrance and hover can overlap.
        animate(card, {
          opacity: [0.2, 1],
          translate: ["0px 18px", "0px 0px"],
          transitionEnd: { translate: "none" },
        }, {
          duration: 0.48,
          ease: [0.22, 1, 0.36, 1],
        });
      }, { margin: "0px 0px 12px 0px" });
    }

    hover(cards, (card) => {
      animate(card, { y: -4 }, { duration: 0.22, ease: "easeOut" });

      return () => {
        animate(card, { y: 0 }, { duration: 0.22, ease: "easeOut" });
      };
    });
  });

  return scope.cancel;
}
