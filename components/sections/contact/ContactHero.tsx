"use client";

import Image from "next/image";

import Header from "@/components/layout/Header";
import QuizEntryButton from "@/components/ui/QuizEntryButton";
import TextReveal from "@/components/ui/TextReveal";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import type { ContactHeroContent } from "@/types/contact-hero-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 982"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23bcdcef"/><stop offset="0.5" stop-color="%23c7a87a"/><stop offset="1" stop-color="%235f4a30"/></linearGradient></defs><rect width="1512" height="982" fill="url(%23sky)"/><rect y="430" width="1512" height="360" fill="%23a07c4d"/><rect y="430" width="1512" height="40" fill="%238a6a3f"/><rect y="540" width="1512" height="36" fill="%238a6a3f"/><rect y="650" width="1512" height="36" fill="%238a6a3f"/><rect y="790" width="1512" height="192" fill="%235a7a3a"/></svg>';

const DEFAULT_CONTENT: ContactHeroContent = {
  headline: "Contact Us",
  backgroundImageUrl: DEFAULT_IMAGE_URL,
  backgroundImageAlt: "Historic stone citadel above a green valley",
};

type ContactHeroProps = {
  content?: ContactHeroContent;
};

function resolveContactHeroContent(
  content?: ContactHeroContent,
): ContactHeroContent {
  return {
    headline: content?.headline?.trim() || DEFAULT_CONTENT.headline,
    backgroundImageUrl:
      content?.backgroundImageUrl?.trim() || DEFAULT_CONTENT.backgroundImageUrl,
    backgroundImageAlt:
      content?.backgroundImageAlt?.trim() || DEFAULT_CONTENT.backgroundImageAlt,
  };
}

export default function ContactHero({ content }: ContactHeroProps) {
  const resolved = resolveContactHeroContent(content);
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
          <QuizEntryButton href="/design-your-travel">Design Your Travel</QuizEntryButton>
        </div>
      </div>

      {/* Top bar — mobile / tablet: pinned, hides/reveals with scroll direction */}
      <div
        className={`fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 lg:hidden ${topBarTransition} ${topBarTransform}`}
      >
        <Header />
        <QuizEntryButton href="/design-your-travel">Design Your Travel</QuizEntryButton>
      </div>

      {/* Centered hero title */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-6 py-12 text-center text-base-white">
        <TextReveal
          as="h1"
          className="font-display text-heading-2 text-base-white"
        >
          {resolved.headline}
        </TextReveal>
      </div>
    </section>
  );
}
