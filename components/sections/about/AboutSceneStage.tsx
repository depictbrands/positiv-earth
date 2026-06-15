"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  CROSSFADE_HALF,
  HEADLINE_EXIT_EM,
  SCENE_BG_HEXES,
  SCENE_IMAGE_MOTION,
  SCENE_LAYER_VH,
  SCENE_MIDPOINTS,
} from "@/lib/about/aboutMotionSpec";
import {
  multiHexLerp,
  panelOpacity,
  parallaxY,
  rangeProgress,
} from "@/lib/about/motion";
import { setDebugValue } from "@/lib/about/debugStore";
import type { AboutSceneContent } from "@/types/about-scene-content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Resting horizontal placement for each scene's two images (Figma about-3/5/7:
// image 0 on the left, image 1 on the right).
const IMAGE_SIDES = ["left", "right"] as const;

// Scene active windows derived from the boundary midpoints (§3): A holds until
// 0.33, B until 0.66, C to the end.
const SCENE_WINDOWS = SCENE_BG_HEXES.map((_, i) => {
  const lo = i === 0 ? 0 : SCENE_MIDPOINTS[i - 1];
  const hi = i < SCENE_MIDPOINTS.length ? SCENE_MIDPOINTS[i] : 1;
  return [lo, hi] as const;
});

type AboutSceneStageProps = {
  // Resolved content for scenes A, B, C (index-aligned with MOTION_SPEC ordering).
  scenes: [AboutSceneContent, AboutSceneContent, AboutSceneContent];
};

// Systems 2 + 3 (MOTION_SPEC §5–6). A sticky-pinned stage spanning SCENE_LAYER_VH
// of scroll: the background colour interpolates olive → blue → coral, the centre
// headline/body crossfades at each boundary, and each scene's two decorative
// images parallax bottom→top. Renders the resting state on the server; motion is
// driven by a single ScrollTrigger. Reduced motion → instant swaps, no parallax.
export default function AboutSceneStage({ scenes }: AboutSceneStageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[][]>([[], [], []]);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = pinRef.current;
    if (!section || !sticky) return;

    const render = (p: number, reduce: boolean) => {
      // System 2 — background interpolation (or snap to active scene if reduced).
      if (reduce) {
        const active = p < SCENE_MIDPOINTS[0] ? 0 : p < SCENE_MIDPOINTS[1] ? 1 : 2;
        sticky.style.backgroundColor = SCENE_BG_HEXES[active];
      } else {
        sticky.style.backgroundColor = multiHexLerp(SCENE_BG_HEXES, p);
      }

      const H = window.innerHeight;

      scenes.forEach((_, i) => {
        const panel = panelRefs.current[i];
        if (panel) {
          panel.style.opacity = String(
            panelOpacity(p, i, SCENE_MIDPOINTS, CROSSFADE_HALF, reduce),
          );
        }

        // System 2 — old headline lifts -0.4em as it exits.
        const text = textRefs.current[i];
        if (text) {
          const upper = i < SCENE_MIDPOINTS.length ? SCENE_MIDPOINTS[i] : Infinity;
          const exitT =
            reduce || upper === Infinity
              ? 0
              : rangeProgress(p, upper - CROSSFADE_HALF, upper + CROSSFADE_HALF);
          text.style.transform = `translateY(${HEADLINE_EXIT_EM * exitT}em)`;
        }

        // System 3 — parallax each image across its scene window.
        const [lo, hi] = SCENE_WINDOWS[i];
        const localP = reduce ? 0.5 : rangeProgress(p, lo, hi);
        SCENE_IMAGE_MOTION[i].forEach((motion, j) => {
          const el = imageRefs.current[i][j];
          if (!el) return;
          const y = parallaxY(H, motion.h, motion.speed, localP);
          el.style.transform = `translateY(calc(-50% + ${y}px))`;
        });
      });

      setDebugValue("2 · scenes", reduce ? 0 : p);
    };

    const mm = gsap.matchMedia();
    mm.add(
      { base: "(min-width: 0px)", reduce: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const reduce = Boolean((ctx.conditions as { reduce: boolean }).reduce);
        const st = ScrollTrigger.create({
          trigger: sticky,
          start: "top top",
          end: `+=${SCENE_LAYER_VH}%`,
          pin: sticky,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => render(self.progress, reduce),
        });
        render(st.progress, reduce);
      },
    );

    return () => mm.revert();
  }, [scenes]);

  return (
    <section ref={sectionRef} className="relative w-full">
      <div
        ref={pinRef}
        className="h-screen w-full overflow-hidden"
        style={{ backgroundColor: SCENE_BG_HEXES[0] }}
      >
        {scenes.map((scene, i) => (
          <div
            key={scene.headline}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center justify-center px-6 will-change-[opacity] sm:px-10"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {/* Decorative parallax images (desktop only). */}
            {scene.images.map((img, j) => (
              <div
                key={img.imageUrl + j}
                aria-hidden={!img.imageAlt}
                ref={(el) => {
                  imageRefs.current[i][j] = el;
                }}
                className={`pointer-events-none absolute top-1/2 hidden overflow-hidden rounded-card-corner will-change-transform lg:block ${
                  IMAGE_SIDES[j] === "left" ? "left-[3vw]" : "right-[3vw]"
                }`}
                style={{ height: `${SCENE_IMAGE_MOTION[i][j].h}px` }}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.imageAlt}
                  width={440}
                  height={560}
                  className="h-full w-auto object-cover"
                />
              </div>
            ))}

            {/* Center text column. */}
            <div
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className="relative z-10 flex max-w-[40rem] flex-col gap-6 text-base-white will-change-transform"
            >
              <h2 className="font-display text-heading-2">{scene.headline}</h2>
              <p className="max-w-[34rem] whitespace-pre-line font-body text-p1">
                {scene.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
