"use client";

import Image from "next/image";

import Header from "@/components/layout/Header";
import QuizEntryButton from "@/components/ui/QuizEntryButton";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import type { ServicesHeroContent } from "@/types/services-hero-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 982"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23bfe3f2"/><stop offset="0.55" stop-color="%236fae6a"/><stop offset="1" stop-color="%232f4a2c"/></linearGradient></defs><rect width="1512" height="982" fill="url(%23sky)"/><path d="M0 540C220 470 360 520 540 470C700 425 860 470 1040 420C1220 370 1360 410 1512 360V982H0V540Z" fill="%23507a3f"/><path d="M0 680C200 630 340 675 520 630C690 588 880 625 1040 580C1220 530 1380 565 1512 520V982H0V680Z" fill="%2335552c"/><rect y="780" width="1512" height="202" fill="%231b2a16" fill-opacity="0.35"/></svg>';

const DEFAULT_CONTENT: ServicesHeroContent = {
  headline: "Luxury Cultural-First Planning",
  backgroundImageUrl: DEFAULT_IMAGE_URL,
  backgroundImageAlt: "Lush green valley viewed from inside a cave opening",
};

type ServicesHeroProps = {
  content?: ServicesHeroContent;
};

function resolveServicesHeroContent(
  content?: ServicesHeroContent,
): ServicesHeroContent {
  return {
    headline: content?.headline?.trim() || DEFAULT_CONTENT.headline,
    backgroundImageUrl:
      content?.backgroundImageUrl?.trim() || DEFAULT_CONTENT.backgroundImageUrl,
    backgroundImageAlt:
      content?.backgroundImageAlt?.trim() || DEFAULT_CONTENT.backgroundImageAlt,
  };
}

export default function ServicesHero({ content }: ServicesHeroProps) {
  const resolved = resolveServicesHeroContent(content);
  const navHidden = useHideOnScroll();

  // The top bar (Header + "Design Your Travel") matches the home hero exactly:
  // it pins to the viewport and slides up on downward scroll, back in on up.
  const topBarTransition =
    "transition-transform duration-300 ease-out will-change-transform";
  const topBarTransform = navHidden ? "-translate-y-[200%]" : "translate-y-0";

  return (
    <section className="relative flex w-full flex-col overflow-hidden min-h-[100svh] lg:min-h-[var(--size-hero-height)]">
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

      {/* Top bar — desktop: nav centered at the top, quiz button pinned right.
          Both pin to the viewport and hide/reveal with scroll direction. */}
      <div className="hidden lg:block">
        <div
          className={`fixed inset-x-0 top-6 z-50 flex justify-center ${topBarTransition} ${topBarTransform}`}
        >
          <Header />
        </div>

        <div
          className={`fixed top-6 z-50 ${topBarTransition} ${topBarTransform}`}
          style={{
            left: "82.0767195767%",
          }}
        >
          <QuizEntryButton>Design Your Travel</QuizEntryButton>
        </div>
      </div>

      {/* Top bar — mobile / tablet: pinned, hides/reveals with scroll direction */}
      <div
        className={`fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 lg:hidden ${topBarTransition} ${topBarTransform}`}
      >
        <Header />
        <QuizEntryButton>Design Your Travel</QuizEntryButton>
      </div>

      {/* Centered hero title */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-6 py-12 text-center text-base-white">
        <h1
          className="mx-auto w-full font-display text-heading-2 text-base-white"
          style={{ maxWidth: "var(--size-services-hero-heading-width)" }}
        >
          {resolved.headline}
        </h1>
      </div>
    </section>
  );
}
