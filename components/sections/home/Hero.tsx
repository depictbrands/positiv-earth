"use client";

import Image from "next/image";

import SearchBar from "@/components/ui/SearchBar";
import TextReveal from "@/components/ui/TextReveal";
import type { HeroContent } from "@/types/hero-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 982"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%239fd8ef"/><stop offset="1" stop-color="%235c3a26"/></linearGradient></defs><rect width="1512" height="982" fill="url(%23sky)"/><path d="M0 300C180 220 280 270 420 210C590 135 660 190 820 125C970 65 1110 110 1280 70C1380 45 1450 55 1512 40V982H0V300Z" fill="%23b36f39"/><path d="M0 420C190 360 300 420 470 350C610 290 760 330 920 270C1080 210 1270 265 1512 180V982H0V420Z" fill="%23955a2f"/><path d="M0 560C150 520 290 575 430 510C560 450 690 500 850 440C1030 370 1175 430 1512 320V982H0V560Z" fill="%23594532"/><rect y="720" width="1512" height="262" fill="%231d1410" fill-opacity="0.35"/></svg>';

const DEFAULT_CONTENT: HeroContent = {
  headline: {
    pre: "A More",
    emphasis: "Meaningful",
    post: "Way to See the World",
  },
  subcopy:
    "A boutique travel advisory for the culturally curious. We design personalized journeys that go beyond the itinerary, so you arrive prepared, present, and ready to connect.",
  backgroundImageUrl: DEFAULT_IMAGE_URL,
  backgroundImageAlt: "Layered mountain landscape at sunrise",
};

type HeroProps = {
  content?: HeroContent;
};

function resolveHeroContent(content?: HeroContent): HeroContent {
  return {
    ...DEFAULT_CONTENT,
    ...content,
    headline: {
      ...DEFAULT_CONTENT.headline,
      ...content?.headline,
    },
    backgroundImageUrl:
      content?.backgroundImageUrl?.trim() || DEFAULT_CONTENT.backgroundImageUrl,
    backgroundImageAlt:
      content?.backgroundImageAlt?.trim() ||
      DEFAULT_CONTENT.backgroundImageAlt,
    subcopy: content?.subcopy?.trim() || DEFAULT_CONTENT.subcopy,
  };
}

function heroHeadlineText(headline: HeroContent["headline"]): string {
  return `${headline.pre} ${headline.emphasis} ${headline.post}`;
}

export default function Hero({ content }: HeroProps) {
  const resolved = resolveHeroContent(content);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex w-full flex-col overflow-hidden min-h-[100svh] lg:min-h-[var(--size-hero-height)]"
    >
      <Image
        src={resolved.backgroundImageUrl}
        alt={resolved.backgroundImageAlt}
        fill
        className="object-cover"
        priority
      />

      {/* Full-bleed dark scrim that also wraps the foreground copy, so the copy
          is measured against a real ancestor background. Renders identically to
          the previous standalone inset-0 overlay (fills the section via flex-1). */}
      <div
        className="relative z-10 flex w-full flex-1 flex-col"
        style={{ backgroundColor: "var(--color-hero-overlay)" }}
      >
      <div
        className="flex w-full flex-1 flex-col items-center justify-center px-6 pb-12 pt-[var(--spacing-hero-content-inset-top-mobile)] text-center text-base-white lg:py-12"
        style={{ gap: "var(--spacing-hero-content-gap)" }}
      >
        <h1 id="hero-heading" className="sr-only">
          {heroHeadlineText(resolved.headline)}
        </h1>

        <div
          aria-hidden="true"
          className="mx-auto flex w-full flex-col items-center lg:leading-none"
          style={{ maxWidth: "var(--size-hero-content-width)" }}
        >
          {/* Mobile / tablet: centered stack */}
          <div
            className="hero-headline-mobile-stack flex flex-col items-center lg:hidden"
            style={{ gap: "var(--spacing-hero-headline-post-gap-mobile)" }}
          >
            <div
              className="flex flex-wrap items-center justify-center"
              style={{ gap: "var(--spacing-hero-headline-gap-mobile)" }}
            >
              <TextReveal className="font-display text-heading-3 uppercase text-base-white">
                {resolved.headline.pre}
              </TextReveal>
              <TextReveal className="hero-headline-emphasis-mobile font-display text-heading-1 text-base-white">
                {resolved.headline.emphasis}
              </TextReveal>
            </div>
            <TextReveal className="font-display text-heading-3 uppercase text-base-white">
              {resolved.headline.post}
            </TextReveal>
          </div>

          {/* Desktop: staggered composition matching Figma (node 584:688) */}
          <div className="hidden lg:grid lg:grid-cols-[max-content] lg:grid-rows-[max-content] lg:place-items-start">
            <div
              className="col-start-1 row-start-1 flex items-center"
              style={{ gap: "var(--spacing-hero-headline-gap)" }}
            >
              <TextReveal className="font-display text-heading-3 uppercase text-base-white">
                {resolved.headline.pre}
              </TextReveal>
              <TextReveal className="font-display text-heading-1 text-base-white">
                {resolved.headline.emphasis}
              </TextReveal>
            </div>
            {/*
              Staggered offset from Figma (node 584:688): "WAY TO SEE THE WORLD"
              sits 437px right / 145px down from "A MORE Meaningful" at the 1512px
              frame. Tokenised so .home-scale can uncap above 1512 like the type.
            */}
            <TextReveal
              className="col-start-1 row-start-1 whitespace-nowrap font-display text-heading-3 uppercase text-base-white"
              style={{
                marginLeft: "var(--spacing-hero-headline-post-offset-x)",
                marginTop: "var(--spacing-hero-headline-post-offset-y)",
              }}
            >
              {resolved.headline.post}
            </TextReveal>
          </div>
        </div>

        <p
          className="mx-auto w-full font-body text-hero-subcopy text-base-white"
          style={{ maxWidth: "var(--size-hero-subcopy-width)" }}
        >
          {resolved.subcopy}
        </p>
      </div>

      <div className="flex w-full justify-center px-6 pb-12 lg:pb-20">
        <SearchBar onSearch={(criteria) => console.log(criteria)} />
      </div>
      </div>
    </section>
  );
}
