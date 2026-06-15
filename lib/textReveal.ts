import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

const REVEAL_DURATION = 0.8;
const REVEAL_EASE = "power2.out";
const REVEAL_STAGGER = 0.12;
const REVEAL_START = "top 85%";
const REVEAL_TOGGLE_ACTIONS = "play none none reverse";

function wrapLines(el: HTMLElement) {
  el.querySelectorAll(".line").forEach((line) => {
    if (line.parentElement?.classList.contains("line-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "line-wrapper";
    line.parentNode?.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });
}

function unwrapLines(el: HTMLElement) {
  el.querySelectorAll(".line-wrapper").forEach((wrapper) => {
    const line = wrapper.querySelector(".line");
    if (line && wrapper.parentNode) {
      wrapper.parentNode.insertBefore(line, wrapper);
    }
    wrapper.remove();
  });
}

/** Initializes line-by-line slide-up reveal on a `.text-reveal` element. */
export function initTextReveal(el: HTMLElement): () => void {
  if (typeof window === "undefined") return () => {};

  gsap.registerPlugin(ScrollTrigger);

  let split: SplitType | null = null;
  let tween: gsap.core.Tween | null = null;

  const markReady = () => {
    el.setAttribute("data-reveal-ready", "");
  };

  const markNotReady = () => {
    el.removeAttribute("data-reveal-ready");
  };

  const destroyAnimation = () => {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = null;
    markNotReady();
    unwrapLines(el);
    split?.revert();
    split = null;
  };

  const setup = () => {
    destroyAnimation();
    markNotReady();

    split = new SplitType(el, {
      types: "lines",
      lineClass: "line",
      absolute: false,
    });
    wrapLines(el);

    const lines = Array.from(el.querySelectorAll<HTMLElement>(".line"));
    if (lines.length === 0) {
      markReady();
      return;
    }

    // GSAP owns transform state — apply hidden offset before revealing the element.
    gsap.set(lines, { yPercent: 100, force3D: true });
    markReady();

    tween = gsap.fromTo(
      lines,
      { yPercent: 100, force3D: true },
      {
        yPercent: 0,
        duration: REVEAL_DURATION,
        ease: REVEAL_EASE,
        stagger: REVEAL_STAGGER,
        force3D: true,
        immediateRender: true,
        scrollTrigger: {
          trigger: el,
          start: REVEAL_START,
          toggleActions: REVEAL_TOGGLE_ACTIONS,
        },
      },
    );
  };

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
        destroyAnimation();
        markReady();
        return;
      }

      setup();

      let resizeTimer: ReturnType<typeof setTimeout>;
      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setup();
          ScrollTrigger.refresh();
        }, 150);
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(resizeTimer);
      };
    },
  );

  return () => {
    mm.revert();
    destroyAnimation();
  };
}
