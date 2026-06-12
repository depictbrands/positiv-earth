"use client";

import Image from "next/image";

import Header from "@/components/layout/Header";
import QuizEntryButton from "@/components/ui/QuizEntryButton";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import type { ItineraryHeroContent } from "@/types/itinerary-hero-content";

const DEFAULT_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 982"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%231b2740"/><stop offset="0.5" stop-color="%23b3702f"/><stop offset="1" stop-color="%23241a12"/></linearGradient></defs><rect width="1512" height="982" fill="url(%23sky)"/><path d="M0 360C220 300 360 350 560 300C760 250 940 310 1160 260C1320 225 1430 240 1512 220V982H0V360Z" fill="%23394a63"/><path d="M0 560C220 510 380 560 600 510C820 460 1020 510 1512 420V982H0V560Z" fill="%231f2a3d"/></svg>';

const DEFAULT_CONTENT: ItineraryHeroContent = {
  country: "Peru",
  title: "Cusco, Machu Picchu",
  durationDays: 6,
  nights: 5,
  travelers: 7,
  backgroundImageUrl: DEFAULT_IMAGE_URL,
  backgroundImageAlt: "Cusco at dusk with the city lights spread across the valley",
};

type ItineraryHeroProps = {
  content?: ItineraryHeroContent;
};

function resolveContent(content?: ItineraryHeroContent): ItineraryHeroContent {
  return {
    country: content?.country?.trim() || DEFAULT_CONTENT.country,
    title: content?.title?.trim() || DEFAULT_CONTENT.title,
    durationDays: content?.durationDays || DEFAULT_CONTENT.durationDays,
    nights: content?.nights || DEFAULT_CONTENT.nights,
    travelers: content?.travelers || DEFAULT_CONTENT.travelers,
    backgroundImageUrl:
      content?.backgroundImageUrl?.trim() || DEFAULT_CONTENT.backgroundImageUrl,
    backgroundImageAlt:
      content?.backgroundImageAlt?.trim() || DEFAULT_CONTENT.backgroundImageAlt,
  };
}

// Small decorative dot used to flank the country eyebrow and separate the meta
// items (Figma ellipses 76 / 77). Purely decorative.
function Dot() {
  return (
    <span
      aria-hidden="true"
      className="block size-2.5 shrink-0 rounded-full bg-base-white"
    />
  );
}

function HeroRule({ thick = false }: { thick?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`block w-full rounded-s-full bg-base-white ${
        thick
          ? "h-[var(--size-itinerary-hero-rule-thick-height)]"
          : "h-px"
      }`}
    />
  );
}

// The itinerary page hero (Figma node 584:1071): a full-bleed image under a dark
// overlay, the shared top bar, then a centered cluster of a country eyebrow, the
// rule-framed trip title, and a meta line (days / nights / travellers). The meta
// numbers use the display serif while the labels use the body sans, matching the
// Figma mixed-font treatment. Presentational — content comes in via props.
export default function ItineraryHero({ content }: ItineraryHeroProps) {
  const resolved = resolveContent(content);
  const navHidden = useHideOnScroll();

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
        style={{ backgroundColor: "var(--color-itinerary-hero-overlay)" }}
      />

      {/* Top bar — desktop: nav centered, quiz button pinned right. Both pin to
          the viewport and hide/reveal with scroll direction (matches heroes). */}
      <div className="hidden lg:block">
        <div
          className={`fixed inset-x-0 top-6 z-50 flex justify-center ${topBarTransition} ${topBarTransform}`}
        >
          <Header />
        </div>

        <div
          className={`fixed top-6 z-50 ${topBarTransition} ${topBarTransform}`}
          style={{ left: "82.0767195767%" }}
        >
          <QuizEntryButton href="/design-your-travel">Design Your Travel</QuizEntryButton>
        </div>
      </div>

      {/* Top bar — mobile / tablet */}
      <div
        className={`fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 lg:hidden ${topBarTransition} ${topBarTransform}`}
      >
        <Header />
        <QuizEntryButton href="/design-your-travel">Design Your Travel</QuizEntryButton>
      </div>

      {/* Centered hero cluster */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-10 px-6 py-28 text-center text-base-white lg:gap-14 lg:py-32">
        {/* Country eyebrow */}
        <p className="flex items-center gap-6 font-body italic text-itinerary-country-name">
          <Dot />
          <span>{resolved.country}</span>
          <Dot />
        </p>

        {/* Rule-framed title — width follows the headline so rules scale with it */}
        <div className="flex w-fit max-w-full flex-col items-stretch gap-6">
          <HeroRule />
          <h1 className="font-display text-heading-2 lg:whitespace-nowrap">
            {resolved.title}
          </h1>
          <div className="flex w-full flex-col gap-3">
            <HeroRule />
            <HeroRule thick />
          </div>
        </div>

        {/* Meta line — numbers in the display serif, labels in the body sans */}
        <p className="flex flex-wrap items-center justify-center gap-4 uppercase text-itinerary-meta">
          <span>
            <span className="font-display">{resolved.durationDays}</span>{" "}
            <span className="font-body">days</span>{" "}
            <span className="font-display">{resolved.nights}</span>{" "}
            <span className="font-body">nights</span>
          </span>
          <Dot />
          <span>
            <span className="font-display">{resolved.travelers}</span>{" "}
            <span className="font-body">travelers</span>
          </span>
        </p>
      </div>
    </section>
  );
}
