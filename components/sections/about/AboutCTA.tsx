"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import QuizEntryButton from "@/components/ui/QuizEntryButton";
import { FOOTER_BAND_H, FOOTER_BAND_SPEED } from "@/lib/about/aboutMotionSpec";
import { lerp } from "@/lib/about/motion";
import { setDebugValue } from "@/lib/about/debugStore";
import type { CTAContent } from "@/types/cta-content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 580"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%231f7fd6"/><stop offset="1" stop-color="%23a9d2f0"/></linearGradient><linearGradient id="hill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%236f9b4a"/><stop offset="1" stop-color="%234a6f33"/></linearGradient></defs><rect width="1512" height="580" fill="url(%23sky)"/><path d="M0 470L380 300L760 360L1140 300L1512 420V580H0V470Z" fill="url(%23hill)"/></svg>';

const DEFAULT_CONTENT: CTAContent = {
  heading: "Let's Plan Your Trip",
  buttonLabel: "Book Free Consultation",
  imageUrl: DEFAULT_IMAGE_URL,
  imageAlt: "Andes mountain under a bright blue sky",
};

type AboutCTAProps = {
  content?: CTAContent;
};

function resolveCtaContent(content?: CTAContent): CTAContent {
  return {
    ...DEFAULT_CONTENT,
    ...content,
    heading: content?.heading?.trim() || DEFAULT_CONTENT.heading,
    buttonLabel: content?.buttonLabel?.trim() || DEFAULT_CONTENT.buttonLabel,
    imageUrl: content?.imageUrl?.trim() || DEFAULT_CONTENT.imageUrl,
    imageAlt: content?.imageAlt?.trim() || DEFAULT_CONTENT.imageAlt,
  };
}

// The "Let's Plan Your Trip" band (MOTION_SPEC §7 / about-8). A travel-up element
// (same family as System 3, NOT pinned): it rises as you scroll past, reusing the
// parallax range built from bandH (580px) and speed 0.8 — it does not fully exit
// the top. The dark footer sits below it in normal flow and never animates.
export default function AboutCTA({ content }: AboutCTAProps) {
  const resolved = resolveCtaContent(content);

  // Heading is two-tone (about-8): first word upright, remainder italic.
  const [headFirst, ...headRest] = resolved.heading.split(" ");
  const headItalic = headRest.join(" ");

  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    // ± travel from parallaxRange(bandH, speed); s < 1 so it lags scroll and
    // never fully clears the top.
    const half = (FOOTER_BAND_SPEED * FOOTER_BAND_H) / 2;

    const mm = gsap.matchMedia();
    mm.add(
      { base: "(min-width: 0px)", reduce: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const reduce = Boolean((ctx.conditions as { reduce: boolean }).reduce);
      if (reduce) {
        inner.style.transform = "translateY(0px)";
        return;
      }
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          inner.style.transform = `translateY(${lerp(half, -half, self.progress)}px)`;
          setDebugValue("F · cta band", self.progress);
        },
      });
      inner.style.transform = `translateY(${lerp(half, -half, st.progress)}px)`;
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-6 py-24 sm:px-10 lg:h-[var(--size-about-cta-band-height)] lg:px-0 lg:py-0"
    >
      <div ref={innerRef} className="will-change-transform lg:absolute lg:inset-0">
        <Image
          src={resolved.imageUrl}
          alt={resolved.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundColor: "var(--color-cta-overlay)" }}
        />

        <div
          className="relative z-10 flex h-full flex-col items-center justify-center text-center"
          style={{ gap: "var(--spacing-cta-content-gap)" }}
        >
          <h2 className="font-display text-heading-2 text-base-white">
            {headFirst}
            {headItalic ? <span className="italic"> {headItalic}</span> : null}
          </h2>

          <QuizEntryButton>{resolved.buttonLabel}</QuizEntryButton>
        </div>
      </div>
    </section>
  );
}
