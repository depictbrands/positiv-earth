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

// Resting position for each scene's decorative images, from about-3/5/7. Both
// axes are expressed in vw (% of the 1512-px frame width), so the whole 1512×982
// composition scales uniformly by width and reproduces the frame exactly at any
// window size — vertical no longer compresses with viewport height. Box sizes
// come from SCENE_IMAGE_MOTION (Figma w×h) via `aspect-ratio`. Index-aligned
// with SCENE_IMAGE_MOTION. (top vw = pixel-y ÷ 1512.)
type SceneImagePos = { left: string; top: string; width: string };
const SCENE_IMAGE_POS: readonly (readonly SceneImagePos[])[] = [
  // Scene A (about-3): centred image (536,96 · 446×485) + right column
  // (1008,334 · 464×532), matching the two-image screenshot.
  [
    { left: "35.450vw", top: "6.349vw", width: "29.497vw" },
    { left: "66.667vw", top: "22.090vw", width: "30.688vw" },
  ],
  // Scene B (about-5): tall left (40,334 · 464×626), landscape top-right (1008,0 · 464×349).
  [
    { left: "2.646vw", top: "22.090vw", width: "30.688vw" },
    { left: "66.667vw", top: "0vw", width: "30.688vw" },
  ],
  // Scene C (about-7): top-left (43,54 · 461×373), bottom-right (1008,580 · 464×357).
  [
    { left: "2.844vw", top: "3.571vw", width: "30.489vw" },
    { left: "66.667vw", top: "38.360vw", width: "30.688vw" },
  ],
];

// Resting position + widths for each scene's text block (Figma Frame 123). The
// vertical (top) is vh so each block stays anchored to the pinned viewport
// height and never rides off-screen; horizontal is vw (or a fixed rem width).
// `width` is the headline/block width; `bodyWidth` narrows the body copy to
// match the design. Applied on desktop only; the block centres on mobile.
// (top vh = pixel-y ÷ 982.)
type SceneTextPos = { left: string; top: string; width: string; bodyWidth: string };
const SCENE_TEXT_POS: readonly SceneTextPos[] = [
  { left: "16.071vw", top: "48vh", width: "40rem", bodyWidth: "35.251vw" }, // A: 243 (vw) / 518 (52.749vh) · block fixed 37rem
  { left: "34.656vw", top: "24vh", width: "43.320vw", bodyWidth: "36.971vw" }, // B: 524 (vw) / 334 (34.012vh)
  { left: "34.656vw", top: "41.344vh", width: "31.217vw", bodyWidth: "31.217vw" }, // C: 524 (vw) / 406 (41.344vh)
];

// Scene text colours (A/B/C): all light against the darker backgrounds.
const SCENE_TEXT_COLORS = [
  "var(--color-about-text-light)",
  "var(--color-about-text-light)",
  "var(--color-about-text-light)",
] as const;

// Rendered image-box height (px) at the current viewport: the box is vw-width
// driven with a Figma aspect ratio, so height = widthPx ÷ (w/h). Feeds the
// System 3 parallax travel.
function sceneImageBoxHeight(i: number, j: number, viewportWidth: number): number {
  const { w, h } = SCENE_IMAGE_MOTION[i][j];
  const widthPx = (viewportWidth * parseFloat(SCENE_IMAGE_POS[i][j].width)) / 100;
  return (widthPx * h) / w;
}

function sceneImageBoxStyle(i: number, j: number): React.CSSProperties {
  const { w, h } = SCENE_IMAGE_MOTION[i][j];
  const pos = SCENE_IMAGE_POS[i][j];
  return {
    left: pos.left,
    top: pos.top,
    width: pos.width,
    aspectRatio: `${w} / ${h}`,
  };
}

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
// of scroll: the background colour interpolates forest → grey → charcoal, the
// headline/body crossfades at each boundary, and each scene's decorative images
// parallax bottom→top at their Figma positions. Renders the resting state on the
// server; motion is
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
          const imageHeight = sceneImageBoxHeight(i, j, window.innerWidth);
          const y = parallaxY(H, imageHeight, motion.speed, localP);
          el.style.transform = `translateY(${y}px)`;
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
    <section
      aria-label="About PositivEarth"
      ref={sectionRef}
      className="relative w-full"
    >
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
            className="absolute inset-0 flex items-center justify-center px-6 will-change-[opacity] sm:px-10 lg:block lg:px-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {/* Decorative parallax images at their exact Figma positions
                (desktop only). Mapped over the layout so scene A renders one
                image and scenes B/C render two. */}
            {SCENE_IMAGE_POS[i].map((_, j) => {
              const img = scene.images[j];
              if (!img) return null;
              const { w, h } = SCENE_IMAGE_MOTION[i][j];
              return (
                <div
                  key={img.imageUrl + j}
                  aria-hidden={!img.imageAlt}
                  ref={(el) => {
                    imageRefs.current[i][j] = el;
                  }}
                  className="pointer-events-none absolute hidden overflow-hidden rounded-card-corner will-change-transform lg:block"
                  style={sceneImageBoxStyle(i, j)}
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.imageAlt}
                    width={w}
                    height={h}
                    className="h-full w-full object-cover"
                  />
                </div>
              );
            })}

            {/* Text block: centred on mobile, positioned at its exact Figma
                Frame-123 coordinates on desktop (via CSS vars). */}
            <div
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className="relative z-10 flex w-full max-w-[34rem] flex-col gap-4 will-change-transform lg:absolute lg:left-[var(--tl)] lg:top-[var(--tt)] lg:w-[var(--tw)] lg:max-w-none lg:gap-[max(0.9375rem,0.992vw)]"
              style={
                {
                  color: SCENE_TEXT_COLORS[i],
                  "--tl": SCENE_TEXT_POS[i].left,
                  "--tt": SCENE_TEXT_POS[i].top,
                  "--tw": SCENE_TEXT_POS[i].width,
                  "--bw": SCENE_TEXT_POS[i].bodyWidth,
                } as React.CSSProperties
              }
            >
              <h2 className="font-display text-heading-4">{scene.headline}</h2>
              <p className="max-w-full whitespace-pre-line font-body text-p1 lg:max-w-[var(--bw)]">
                {scene.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
