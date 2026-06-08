"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { INTRO_LINES } from "@/lib/about/aboutMotionSpec";
import { easeOut, rangeProgress } from "@/lib/about/motion";
import { setDebugValue } from "@/lib/about/debugStore";
import type { AboutIntroContent } from "@/types/about-intro-content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DEFAULT_PORTRAIT_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 540"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%237fa9d0"/><stop offset="1" stop-color="%23cfe0ee"/></linearGradient></defs><rect width="440" height="540" fill="url(%23sky)"/><path d="M0 360L150 230L300 360L440 270V540H0V360Z" fill="%236f7d52"/><path d="M0 430L180 340L360 430L440 380V540H0V430Z" fill="%23566441"/></svg>';

const DEFAULT_CONTENT: AboutIntroContent = {
  stats: [
    { emphasis: "12 years", rest: "in airline industry" },
    { emphasis: "Psychology", rest: "master degree" },
    { emphasis: "100+", rest: "destinations experience" },
  ],
  portraitImageUrl: DEFAULT_PORTRAIT_URL,
  portraitImageAlt: "Jorge exploring a mountain-top archaeological site",
};

// Resting (end) positions for each stat, from MOTION_SPEC §4 — the about-2
// layout System 1 lifts the lines into.
const REST_POSITIONS = INTRO_LINES.map((l) => ({
  top: `${l.endYvh}vh`,
  left: `${l.endXvw}vw`,
}));

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

function Stat({ emphasis, rest }: { emphasis: string; rest: string }) {
  return (
    <p className="text-heading-3 leading-tight">
      <span className="font-display italic text-[color:var(--color-about-accent)]">
        {emphasis}
      </span>{" "}
      <span className="font-merriweather-sans font-bold text-base-black">
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

    // System 1 — the three lines rise from their off-screen start (MOTION_SPEC
    // §4 start Y/X) to their resting positions as the page scrolls hero → intro.
    const apply = (progress: number, reduce: boolean) => {
      const vh = window.innerHeight / 100;
      const vw = window.innerWidth / 100;
      INTRO_LINES.forEach((line, i) => {
        const el = lineRefs.current[i];
        if (!el) return;
        const lineP = reduce
          ? 1
          : easeOut(rangeProgress(progress, line.stagger, 1));
        const dy = (line.startYvh - line.endYvh) * (1 - lineP) * vh;
        const dx = (line.startXvw - line.endXvw) * (1 - lineP) * vw;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      setDebugValue("1 · intro", reduce ? 1 : progress);
    };

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
        if (!isDesktop) {
          // Mobile stacks in normal flow — clear any transform.
          lineRefs.current.forEach((el) => el && (el.style.transform = ""));
          return;
        }
        if (reduce) {
          apply(1, true);
          return;
        }
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => apply(self.progress, false),
        });
        apply(st.progress, false);
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
          MOTION_SPEC §4 resting positions, lifted into place by System 1. */}
      <div className="relative hidden h-screen w-full lg:block">
        <div className="absolute left-1/2 top-1/2 w-[var(--size-about-intro-portrait-width)] -translate-x-1/2 -translate-y-1/2">
          <Image
            src={portraitImageUrl}
            alt={portraitImageAlt}
            width={440}
            height={540}
            className="h-auto w-full rounded-card-corner object-cover"
          />
        </div>

        {stats.map((stat, i) => (
          <div
            key={stat.emphasis}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className="absolute max-w-[var(--size-about-intro-stat-width)] will-change-transform"
            style={REST_POSITIONS[i]}
          >
            <Stat {...stat} />
          </div>
        ))}
      </div>
    </section>
  );
}
