"use client";

import HeroBackgroundImage from "@/components/ui/HeroBackgroundImage";
import TextReveal from "@/components/ui/TextReveal";
import { resolveHeroBackgroundImage } from "@/lib/resolveHeroBackgroundImage";
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
    ...resolveHeroBackgroundImage(content, DEFAULT_CONTENT),
  };
}

export default function FAQHero({ content }: FAQHeroProps) {
  const resolved = resolveFaqHeroContent(content);

  return (
    <section
      aria-labelledby="faq-hero-heading"
      className="relative flex w-full flex-col overflow-hidden min-h-[100svh] lg:min-h-[var(--size-hero-height)]"
    >
      <HeroBackgroundImage content={resolved} />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: "var(--color-hero-overlay)" }}
      />

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
