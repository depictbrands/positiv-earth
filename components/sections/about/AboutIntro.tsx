"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  INTRO_DURATION_MS,
  INTRO_EASE_BEZIER,
  INTRO_LINES,
} from "@/lib/about/aboutMotionSpec";
import { cubicBezier } from "@/lib/about/motion";
import { setDebugValue } from "@/lib/about/debugStore";
import type { AboutIntroContent } from "@/types/about-intro-content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DEFAULT_PORTRAIT_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 439 519"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%237fa9d0"/><stop offset="1" stop-color="%23cfe0ee"/></linearGradient></defs><rect width="439" height="519" fill="url(%23sky)"/><path d="M0 350L150 220L300 350L439 260V519H0V350Z" fill="%236f7d52"/><path d="M0 420L180 330L360 420L439 370V519H0V420Z" fill="%23566441"/></svg>';

const DEFAULT_CONTENT: AboutIntroContent = {
  stats: [
    { emphasis: "12 years", rest: "in airline industry" },
    { emphasis: "Psychology", rest: "master degree" },
    { emphasis: "100+", rest: "destinations experience" },
  ],
  portraitImageUrl: DEFAULT_PORTRAIT_URL,
  portraitImageAlt: "Jorge exploring a mountain-top archaeological site",
};

// Resting (end) positions for each stat, from MOTION_SPEC §4 / Figma node 40:18.
const REST_POSITIONS = INTRO_LINES.map((l) => ({
  top: `${l.endYvh}vh`,
  left: `${l.endXvw}vw`,
}));

// Per-line box width (as a % of the 1512 frame) and text alignment, straight
// from the about-2 text boxes: line 1 662px left, line 2 498px left, line 3
// 767px right-aligned. The width drives the exact wrap from the design.
const STAT_LAYOUT = [
  { width: "43.783vw", align: "left", stacked: false },
  { width: "32.937vw", align: "left", stacked: false },
  // Line 3 ("100+ destinations experience") is right-aligned and the two parts
  // sit on their own lines in the design (node 40:51), not inline-wrapped.
  { width: "50.728vw", align: "right", stacked: true },
] as const;

// Portrait box (439×519px) top-left at (448, 274) in the frame → %s of 1512×982.
// Width stays pure vw so it scales with the vw-positioned stat lines at every
// width, including above the 1512 frame (uniform scale-up). The fixed-rem cap is
// the resting design width reached exactly at 1512 (29.034vw === 27.4375rem).
const PORTRAIT = {
  left: "29.630vw",
  top: "27.902vh",
  width: "29.034vw",
} as const;

type AboutIntroProps = {
  content?: AboutIntroContent;
};

function resolveIntroContent(content?: AboutIntroContent): AboutIntroContent {
  const stats = content?.stats;
  const resolveStat = (i: number) => ({
    emphasis: stats?.[i]?.emphasis?.trim() || DEFAULT_CONTENT.stats[i].emphasis,
    rest: stats?.[i]?.rest?.trim() || DEFAULT_CONTENT.stats[i].rest,
  });
  return {
    stats: [resolveStat(0), resolveStat(1), resolveStat(2)],
    portraitImageUrl:
      content?.portraitImageUrl?.trim() || DEFAULT_CONTENT.portraitImageUrl,
    portraitImageAlt:
      content?.portraitImageAlt?.trim() || DEFAULT_CONTENT.portraitImageAlt,
  };
}

// A two-tone credential line (node 40:18): burnt-orange Merriweather italic
// emphasis (96px) + Raleway SemiBold rest (64px), sharing an 80px line box.
function Stat({
  emphasis,
  rest,
  stacked = false,
}: {
  emphasis: string;
  rest: string;
  stacked?: boolean;
}) {
  const emphasisCls =
    "font-display italic text-about-stat-emphasis text-[color:var(--color-about-accent)]";
  const restCls = "font-body text-about-stat-rest text-base-black";

  if (stacked) {
    return (
      <p className="m-0">
        <span className={`block ${emphasisCls}`}>{emphasis}</span>
        <span className={`block ${restCls}`}>{rest}</span>
      </p>
    );
  }

  return (
    <p className="m-0">
      <span className={emphasisCls}>{emphasis}</span>
      <span className={restCls}>
        {" "}
        {rest}
      </span>
    </p>
  );
}

export default function AboutIntro({ content }: AboutIntroProps) {
  const { stats, portraitImageUrl, portraitImageAlt } =
    resolveIntroContent(content);

  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // System 1 — a one-shot transition (MOTION_SPEC §4): when the intro scrolls
    // into view the three lines rise from their off-screen start to their resting
    // positions over INTRO_DURATION_MS, with a custom cubic-bezier ease and a
    // per-line stagger (a fraction of the duration). Not scrubbed.
    const durationS = INTRO_DURATION_MS / 1000;
    const ease = cubicBezier(...INTRO_EASE_BEZIER);

    const mm = gsap.matchMedia();
    mm.add(
      {
        base: "(min-width: 0px)",
        isDesktop: "(min-width: 1024px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isDesktop, reduce } = ctx.conditions as {
          isDesktop: boolean;
          reduce: boolean;
        };
        const els = lineRefs.current.filter(
          (el): el is HTMLDivElement => el !== null,
        );

        if (!isDesktop) {
          // Mobile stacks in normal flow — no transform.
          gsap.set(els, { clearProps: "transform" });
          return;
        }
        if (reduce) {
          // Reduced motion: lines appear at rest immediately, no travel.
          gsap.set(els, { x: 0, y: 0 });
          setDebugValue("1 · intro", 1);
          return;
        }

        const tl = gsap.timeline({
          paused: true,
          onUpdate: () => setDebugValue("1 · intro", tl.progress()),
        });

        INTRO_LINES.forEach((line, i) => {
          const el = lineRefs.current[i];
          if (!el) return;
          tl.fromTo(
            el,
            {
              x: () => ((line.startXvw - line.endXvw) * window.innerWidth) / 100,
              y: () => ((line.startYvh - line.endYvh) * window.innerHeight) / 100,
            },
            { x: 0, y: 0, duration: durationS, ease, immediateRender: true },
            line.stagger * durationS,
          );
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top 75%",
          animation: tl,
          toggleActions: "play none none reset",
          invalidateOnRefresh: true,
        });
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-cream-white text-base-black"
    >
      {/* Mobile / tablet: the absolute vh/vw composition can't reflow, so the
          portrait and lines stack in normal flow below the desktop breakpoint. */}
      <div className="flex flex-col items-center gap-10 px-6 py-24 sm:px-10 lg:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- placeholder data-URI until CMS image */}
        <img
          src={portraitImageUrl}
          alt={portraitImageAlt}
          className="w-full max-w-[var(--size-about-intro-portrait-width)] rounded-card-corner object-cover"
        />
        {stats.map((stat) => (
          <Stat key={stat.emphasis} {...stat} />
        ))}
      </div>

      {/* Desktop (1512px frame): centre portrait with the three stats at their
          exact about-2 (node 40:18) resting positions, lifted into place by
          System 1. */}
      <div className="relative hidden h-[115vh] w-full lg:block">
        <div className="absolute" style={PORTRAIT}>
          <Image
            src={portraitImageUrl}
            alt={portraitImageAlt}
            width={439}
            height={519}
            className="h-auto w-full rounded-card-corner object-cover"
          />
        </div>

        {stats.map((stat, i) => (
          <div
            key={stat.emphasis}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className={`absolute will-change-transform ${
              STAT_LAYOUT[i].align === "right" ? "text-right" : "text-left"
            }`}
            style={{
              top: REST_POSITIONS[i].top,
              left: REST_POSITIONS[i].left,
              width: STAT_LAYOUT[i].width,
            }}
          >
            <Stat {...stat} stacked={STAT_LAYOUT[i].stacked} />
          </div>
        ))}
      </div>
    </section>
  );
}
