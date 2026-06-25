"use client";

import Image from "next/image";

import TextReveal from "@/components/ui/TextReveal";
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
function Dot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block size-2.5 shrink-0 rounded-full bg-base-white ${className ?? ""}`}
    />
  );
}

// The itinerary page hero (Figma node 584:1071): a full-bleed image under a dark
// overlay, the shared top bar, then a bottom-left cluster of a country eyebrow,
// the trip title, and a meta line (days / nights / travellers). The meta
// numbers use the display serif while the labels use the body sans, matching the
// Figma mixed-font treatment. Presentational — content comes in via props.
export default function ItineraryHero({ content }: ItineraryHeroProps) {
  const resolved = resolveContent(content);

  return (
    <section
      aria-labelledby="itinerary-hero-heading"
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
        style={{ backgroundColor: "var(--color-itinerary-hero-overlay)" }}
      />

      {/* Hero content cluster — bottom-left on desktop; fluid insets on mobile */}
      <div className="relative z-10 flex w-full max-w-full flex-1 flex-col items-start justify-end gap-4 px-6 pb-12 pt-24 text-left text-base-white sm:px-10 sm:pb-16 lg:max-w-[var(--size-itinerary-hero-content-width)] lg:gap-[var(--spacing-itinerary-local-food-heading-gap)] lg:px-0 lg:pb-[var(--spacing-itinerary-hero-inset-bottom)] lg:pl-[var(--spacing-itinerary-hero-inset-x)] lg:pt-0">
        {/* Country eyebrow */}
        <p className="flex items-center gap-4 font-body italic text-itinerary-country-name lg:gap-6">
          <Dot />
          <TextReveal className="font-body italic text-itinerary-country-name">
            {resolved.country}
          </TextReveal>
          <Dot />
        </p>

        {/* Title — wraps on mobile, single line on desktop */}
        <div className="flex w-full max-w-full flex-col items-stretch gap-4 lg:w-fit lg:gap-6">
          <TextReveal
            as="h1"
            id="itinerary-hero-heading"
            className="max-w-full font-display text-heading-2 lg:whitespace-nowrap"
          >
            {resolved.title}
          </TextReveal>
        </div>

        {/* Meta line — stacks on narrow screens, inline from sm up */}
        <p className="flex flex-col items-start gap-3 uppercase text-itinerary-meta sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <TextReveal className="uppercase text-itinerary-meta">
            <span>
              <span className="font-display">{resolved.durationDays}</span>{" "}
              <span className="font-body">days</span>{" "}
              <span className="font-display">{resolved.nights}</span>{" "}
              <span className="font-body">nights</span>
            </span>
          </TextReveal>
          <Dot className="hidden sm:block" />
          <TextReveal className="uppercase text-itinerary-meta">
            <span>
              <span className="font-display">{resolved.travelers}</span>{" "}
              <span className="font-body">travelers</span>
            </span>
          </TextReveal>
        </p>
      </div>
    </section>
  );
}
