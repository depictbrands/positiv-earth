import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const REVEAL_DURATION = 1;
const REVEAL_EASE = "power2.out";
const REVEAL_START = "top 85%";

/**
 * Left-to-right clip-path wipe reveal. The element is fully clipped from the
 * right, then wipes open toward the right edge when it scrolls into view.
 * Honours the element's border-radius and `prefers-reduced-motion`.
 */
export function initPhotoReveal(el: HTMLElement | null): () => void {
  if (typeof window === "undefined" || !el) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  // Match the element's rounded corners so the wipe keeps the card shape.
  const radius = getComputedStyle(el).borderTopLeftRadius || "0px";
  const hidden = `inset(0% 100% 0% 0% round ${radius})`;
  const shown = `inset(0% 0% 0% 0% round ${radius})`;

  const mm = gsap.matchMedia();
  mm.add(
    {
      base: "(min-width: 0px)",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const reduce = Boolean(
        (context.conditions as { reduce?: boolean }).reduce,
      );

      if (reduce) {
        gsap.set(el, { clearProps: "clipPath" });
        return;
      }

      const tween = gsap.fromTo(
        el,
        { clipPath: hidden },
        {
          clipPath: shown,
          duration: REVEAL_DURATION,
          ease: REVEAL_EASE,
          scrollTrigger: {
            trigger: el,
            start: REVEAL_START,
            toggleActions: "play none none none",
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(el, { clearProps: "clipPath" });
      };
    },
  );

  return () => {
    mm.revert();
  };
}
