import type { Metadata } from "next";
import type { CSSProperties } from "react";

import Footer from "@/components/layout/Footer";
import { DEFAULT_DESTINATIONS } from "@/components/sections/home/Destinations";
import Accommodation from "@/components/sections/itinerary/Accommodation";
import WhatsIncluded from "@/components/sections/itinerary/WhatsIncluded";
import ItineraryHero from "@/components/sections/itinerary/ItineraryHero";
import ItineraryTimeline from "@/components/sections/itinerary/ItineraryTimeline";
import LocalFood from "@/components/sections/itinerary/LocalFood";
import NextItineraries from "@/components/sections/itinerary/NextItineraries";
import Overview from "@/components/sections/itinerary/Overview";
import RecordItineraryView from "@/components/sections/itinerary/RecordItineraryView";
import {
  normalizeItineraryAccentHex,
  type ItineraryContent,
} from "@/types/itinerary-content";
import type { ItineraryNextItinerariesContent } from "@/types/itinerary-next-itineraries-content";

/**
 * Itinerary route — a reusable template for every destination itinerary.
 *
 * Each destination resolves to `/itinerary/<slug>`. Content currently comes from
 * the local `ITINERARIES` map below (the data seam); this is where a Sanity fetch
 * by slug will drop in once the itinerary document is modelled, mirroring how the
 * other routes fetch + map server-side. Any unknown slug still renders via a
 * slug-derived fallback so destination cards never dead-end.
 */

const ITINERARIES: Record<string, ItineraryContent> = {
  "cusco-machu-picchu": {
    accentColor: "#cf3030",
    hero: {
      country: "Peru",
      title: "Cusco, Machu Picchu",
      durationDays: 6,
      nights: 5,
      travelers: 7,
      backgroundImageUrl: "",
      backgroundImageAlt:
        "Cusco at dusk with the city lights spread across the valley",
    },
  },
};

function titleizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getItinerary(slug: string): ItineraryContent {
  const known = ITINERARIES[slug];
  if (known) return known;

  return {
    hero: {
      country: "",
      title: titleizeSlug(slug),
      durationDays: 0,
      nights: 0,
      travelers: 0,
      backgroundImageUrl: "",
      backgroundImageAlt: "",
    },
  };
}

function buildNextItineraries(
  slug: string,
  itinerary: ItineraryContent,
): ItineraryNextItinerariesContent {
  const configured = itinerary.nextItineraries;
  const allDestinations = itinerary.destinations ?? DEFAULT_DESTINATIONS;
  const currentHref = `/itinerary/${slug}`;
  const destinations = (configured?.destinations ?? allDestinations).filter(
    (destination) => destination.href !== currentHref,
  );

  return {
    headingLeading: configured?.headingLeading ?? "Next",
    headingTrailing: configured?.headingTrailing ?? "Itineraries",
    destinations,
    editorialSlugs: configured?.editorialSlugs,
  };
}

type ItineraryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ItineraryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { hero } = getItinerary(slug);
  return {
    title: `${hero.title} | Positiv Earth`,
  };
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const { slug } = await params;
  const itinerary = getItinerary(slug);
  const nextItineraries = buildNextItineraries(slug, itinerary);
  const accentColor = normalizeItineraryAccentHex(itinerary.accentColor);
  const accentStyle: CSSProperties | undefined = accentColor
    ? ({ "--color-itinerary-accent": accentColor } as CSSProperties)
    : undefined;

  return (
    <main
      className="flex w-full flex-col items-center"
      style={accentStyle}
    >
      <RecordItineraryView slug={slug} />
      <ItineraryHero content={itinerary.hero} />
      <Overview content={itinerary.overview} />
      <ItineraryTimeline content={itinerary.timeline} />
      <LocalFood content={itinerary.localFood} />
      <Accommodation content={itinerary.accommodation} />
      <WhatsIncluded content={itinerary.whatsIncluded} />
      <NextItineraries content={nextItineraries} currentSlug={slug} />
      <Footer />
    </main>
  );
}
