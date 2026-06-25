"use client";

import Image from "next/image";

import Header from "@/components/layout/Header";
import QuizEntryButton from "@/components/ui/QuizEntryButton";
import TextReveal from "@/components/ui/TextReveal";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import type { FaqHeroContent } from "@/types/faq-hero-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 982"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%237fc8e8"/><stop offset="0.55" stop-color="%23bfa77a"/><stop offset="1" stop-color="%231f6f86"/></linearGradient></defs><rect width="1512" height="982" fill="url(%23sky)"/><path d="M0 520C220 470 360 500 540 470C720 440 880 480 1060 450C1240 420 1380 455 1512 430V982H0V520Z" fill="%238a7a52"/><path d="M0 660C200 620 360 655 540 625C720 595 900 630 1080 600C1260 570 1380 600 1512 575V982H0V660Z" fill="%23196a80"/><rect y="780" width="1512" height="202" fill="%230f3c49" fill-opacity="0.4"/></svg>';

const DEFAULT_CONTENT: FaqHeroContent = {
  headline: "FAQ",
  backgroundImageUrl: DEFAULT_IMAGE_URL,
  backgroundImageAlt: "Coastal fortress overlooking turquoise water",
};

type FAQHeroProps = {
  content?: FaqHeroContent;
};

function resolveFaqHeroContent(content?: FaqHeroContent): FaqHeroContent {
  return {
    headline: content?.headline?.trim() || DEFAULT_CONTENT.headline,
    backgroundImageUrl:
      content?.backgroundImageUrl?.trim() || DEFAULT_CONTENT.backgroundImageUrl,
    backgroundImageAlt:
      content?.backgroundImageAlt?.trim() || DEFAULT_CONTENT.backgroundImageAlt,
  };
}

export default function FAQHero({ content }: FAQHeroProps) {
  const resolved = resolveFaqHeroContent(content);
  const navHidden = useHideOnScroll();

  // The top bar (Header + "Design Your Travel") matches the home hero exactly:
  // it pins to the viewport and slides up on downward scroll, back in on up.
  const topBarTransition =
    "transition-transform duration-300 ease-out will-change-transform";
  const topBarTransform = navHidden ? "-translate-y-[200%]" : "translate-y-0";

  return (
    <section
      aria-labelledby="faq-hero-heading"
      className="relative flex w-full flex-col overflow-hidden min-h-[100svh] lg:min-h-[var(--size-hero-height)]"
    >
      <Image
        src={resolved.backgroundImageUrl}
        alt={resolved.backgroundImageAlt}
        fill
        className="object-cover"
        priority
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: "var(--color-hero-overlay)" }}
      />

      {/* Top bar — single Header landmark; layout responds inside Header.tsx */}
      <div
        className={`fixed inset-x-0 top-0 z-50 px-5 pt-5 sm:px-8 lg:px-0 lg:pt-6 ${topBarTransition} ${topBarTransform}`}
      >
        <div className="relative w-full">
          <div className="flex items-start justify-between gap-4 lg:block">
            <div className="min-w-0 flex-1 lg:w-full lg:flex lg:justify-center">
              <Header />
            </div>
            <div className="shrink-0 lg:absolute lg:top-0 lg:left-[82.0767195767%]">
              <QuizEntryButton href="/design-your-travel">
                Design Your Travel
              </QuizEntryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Centered hero title (Figma node 584:1897 — "FAQ", heading-2 / 96px
          Merriweather). sr-only h1 carries the readable title; TextReveal is
          visual/decorative only. */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-6 py-12 text-center text-base-white">
        <h1 id="faq-hero-heading" className="sr-only">
          {resolved.headline}
        </h1>
        <div aria-hidden="true">
          <TextReveal className="font-display text-heading-2 text-base-white">
            {resolved.headline}
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
