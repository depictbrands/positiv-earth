"use client";

import { useEffect, useMemo, useState } from "react";

import DestinationCard from "@/components/ui/DestinationCard";
import {
  pickNextItinerariesFallback,
  recommendNextItineraries,
} from "@/lib/itinerary/recommendNextItineraries";
import type { ItineraryNextItinerariesContent } from "@/types/itinerary-next-itineraries-content";

const DEFAULT_CONTENT: ItineraryNextItinerariesContent = {
  headingLeading: "Next",
  headingTrailing: "Itineraries",
  destinations: [],
};

type NextItinerariesProps = {
  content?: ItineraryNextItinerariesContent;
  /** Current `/itinerary/[slug]` — excluded from recommendations. */
  currentSlug: string;
};

function resolveContent(
  content?: ItineraryNextItinerariesContent,
): ItineraryNextItinerariesContent {
  return {
    headingLeading:
      content?.headingLeading?.trim() || DEFAULT_CONTENT.headingLeading,
    headingTrailing:
      content?.headingTrailing?.trim() || DEFAULT_CONTENT.headingTrailing,
    destinations: content?.destinations ?? DEFAULT_CONTENT.destinations,
    editorialSlugs: content?.editorialSlugs,
  };
}

// Itinerary "NextItineraries" (Figma 584:1248): two uniform destination cards
// beside a two-line heading. Cards are chosen client-side from the home
// destination pool using behavior signals (see recommendNextItineraries).
export default function NextItineraries({
  content,
  currentSlug,
}: NextItinerariesProps) {
  const resolved = resolveContent(content);

  const fallback = useMemo(
    () =>
      pickNextItinerariesFallback(resolved.destinations, currentSlug),
    [resolved.destinations, currentSlug],
  );

  const [recommended, setRecommended] = useState(fallback);

  useEffect(() => {
    setRecommended(
      recommendNextItineraries({
        destinations: resolved.destinations,
        currentSlug,
        editorialSlugs: resolved.editorialSlugs,
      }),
    );
  }, [resolved.destinations, resolved.editorialSlugs, currentSlug]);

  if (recommended.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden bg-base-black">
      <div className="mx-auto flex w-full max-w-[var(--size-itinerary-overview-width)] flex-col gap-10 px-6 py-16 sm:px-10 lg:flex-row lg:items-start lg:justify-between lg:px-0 lg:py-22">
        <h2 className="shrink-0 font-display text-heading-4 text-base-white lg:w-[var(--size-next-itineraries-heading-width)]">
          <span className="block">{resolved.headingLeading}</span>
          <span className="block">{resolved.headingTrailing}</span>
        </h2>

        <div
          className="grid w-full min-w-0 flex-1 grid-cols-1 gap-[var(--spacing-next-itineraries-cards-gap)] sm:grid-cols-2"
        >
          {recommended.map((destination, index) => (
            <DestinationCard
              key={`${destination.name}-${index}`}
              destination={destination}
              layout="next-itinerary"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
