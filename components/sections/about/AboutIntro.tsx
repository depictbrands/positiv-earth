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
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 794 518"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%237fa9d0"/><stop offset="1" stop-color="%23cfe0ee"/></linearGradient></defs><rect width="794" height="518" fill="url(%23sky)"/><path d="M0 350L260 210L520 350L794 240V518H0V350Z" fill="%236f7d52"/><path d="M0 430L300 320L600 430L794 360V518H0V430Z" fill="%23566441"/></svg>';

const DEFAULT_CONTENT: AboutIntroContent = {
  stats: [
    { emphasis: "12 years", rest: "in airline industry" },
    { emphasis: "Psychology", rest: "master degree" },
    { emphasis: "100+", rest: "destinations experience" },
  ],
  portraitImageUrl: DEFAULT_PORTRAIT_URL,
  portraitImageAlt: "Jorge exploring a mountain-top archaeological site",
};

// Resting (end) positions for each stat — tokens in globals.css (desktop only).
const STAT_POSITIONS = [
  {
    top: "var(--position-about-intro-stat-1-top)",
    left: "var(--position-about-intro-stat-1-left)",
  },
  {
    top: "var(--position-about-intro-stat-2-top)",
    left: "var(--position-about-intro-stat-2-left)",
  },
  {
    top: "var(--position-about-intro-stat-3-top)",
    left: "var(--position-about-intro-stat-3-left)",
  },
] as const;

// Per-line box width (as a % of the 1512 frame) and text alignment, straight
// from the about-2 text boxes (node 1150:1734): line 1 333px left, line 2 473px
// left, line 3 389px right-aligned. Each line stacks its emphasis over its rest
// (matching the flex-col text boxes in the design); the width drives the wrap.
const STAT_LAYOUT = [
  { width: "22.024vw", align: "left", stacked: true },
  { width: "31.283vw", align: "left", stacked: true },
  { width: "25.728vw", align: "right", stacked: true },
] as const;

// Scene image box (794×518px) top-left at (165, 334) in the frame — tokens in
// globals.css.
const PORTRAIT = {
  left: "var(--position-about-intro-portrait-left)",
  top: "var(--position-about-intro-portrait-top)",
  width: "var(--size-about-intro-portrait-vw)",
  height: "var(--size-about-intro-portrait-height-vw)",
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

// A credential line (node 40:18): both emphasis and rest now use the light-green
// About intro text token.
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
    "font-display italic text-about-stat-emphasis text-about-accent whitespace-nowrap";
  const restCls = "font-body text-about-stat-rest text-base-white";

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
          // Reduced motion: lines appear at rest immediately, visible, no travel.
          gsap.set(els, { opacity: 1, x: 0, y: 0 });
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
          // Each line reveals — fading from invisible to visible while sliding
          // in from one full span of itself, measured live so the travel
          // distance tracks the element's rendered size at any viewport width:
          // line 1 from one width left, line 2 from one width right, line 3
          // from one height below.
          const from =
            line.slide === "left"
              ? { opacity: 0, x: () => -el.offsetWidth, y: 0 }
              : line.slide === "right"
                ? { opacity: 0, x: () => el.offsetWidth, y: 0 }
                : { opacity: 0, x: 0, y: () => el.offsetHeight };
          tl.fromTo(
            el,
            from,
            { opacity: 1, x: 0, y: 0, duration: durationS, ease, immediateRender: true },
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
      aria-label="About Jorge"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-about-forest text-about-text-light"
      style={{ backgroundColor: "var(--color-about-forest)" }}
    >
      {/* Mobile / tablet: the absolute vh/vw composition can't reflow, so the
          portrait and lines stack in normal flow below the desktop breakpoint. */}
      <div className="flex flex-col items-start gap-10 px-6 py-24 sm:px-10 lg:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- placeholder data-URI until CMS image */}
        <img
          src={portraitImageUrl}
          alt={portraitImageAlt}
          className="h-[var(--size-about-intro-portrait-height)] w-full max-w-[var(--size-about-intro-portrait-width)] self-center rounded-about-intro-portrait-corner object-cover"
        />
        {stats.map((stat) => (
          <Stat key={stat.emphasis} {...stat} />
        ))}
      </div>

      {/* Desktop (1512px frame): centre portrait with the three stats at their
          exact about-2 (node 40:18) resting positions, lifted into place by
          System 1. */}
      <div className="relative hidden min-h-[var(--size-about-intro-section-height)] w-full lg:block">
        <div
          className="absolute inset-x-0 h-full"
          style={{ top: "var(--spacing-about-intro-cluster-offset-top)" }}
        >
          <div
            className="absolute overflow-hidden rounded-about-intro-portrait-corner"
            style={PORTRAIT}
          >
            <Image
              src={portraitImageUrl}
              alt={portraitImageAlt}
              width={794}
              height={518}
              className="h-full w-full object-cover"
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
                top: STAT_POSITIONS[i].top,
                left: STAT_POSITIONS[i].left,
                width: STAT_LAYOUT[i].width,
              }}
            >
              <Stat {...stat} stacked={STAT_LAYOUT[i].stacked} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
