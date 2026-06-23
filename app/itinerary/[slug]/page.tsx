import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { mapDestination, mapItinerary } from "@/sanity/lib/mapItinerary";
import {
  HOME_DESTINATIONS_QUERY,
  ITINERARY_BY_SLUG_QUERY,
  ITINERARY_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import {
  normalizeItineraryAccentHex,
  type ItineraryContent,
} from "@/types/itinerary-content";
import type { ItineraryNextItinerariesContent } from "@/types/itinerary-next-itineraries-content";
import type { Destination } from "@/types/destination";

/**
 * Itinerary route — a reusable template for every destination itinerary.
 *
 * Each destination resolves to `/itinerary/<slug>`. Content is fetched from
 * Sanity by slug; section components still fall back to local defaults when a
 * section is omitted in the CMS. Without Sanity configured, local dev fallbacks
 * keep destination cards from dead-ending.
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

function getLocalItinerary(slug: string): ItineraryContent {
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

async function fetchDestinations(): Promise<Destination[]> {
  if (!client) {
    return DEFAULT_DESTINATIONS;
  }

  const sanityDestinations = await client.fetch(HOME_DESTINATIONS_QUERY);
  const mapped = (sanityDestinations ?? []).map(mapDestination);

  return mapped.length > 0 ? mapped : DEFAULT_DESTINATIONS;
}

async function resolveItinerary(slug: string): Promise<ItineraryContent> {
  if (!client) {
    return getLocalItinerary(slug);
  }

  const [sanityItinerary, destinations] = await Promise.all([
    client.fetch(ITINERARY_BY_SLUG_QUERY, { slug }),
    fetchDestinations(),
  ]);

  const mapped = mapItinerary(sanityItinerary);

  if (!mapped) {
    if (isSanityConfigured) {
      notFound();
    }

    return getLocalItinerary(slug);
  }

  return {
    ...mapped,
    destinations,
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

export async function generateStaticParams() {
  if (!client) {
    return [];
  }

  const slugs: Array<{ slug: string }> = await client.fetch(ITINERARY_SLUGS_QUERY);

  return slugs
    .map(({ slug }) => slug?.trim())
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ItineraryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const itinerary = await resolveItinerary(slug);

  return {
    title: `${itinerary.hero.title} | Positiv Earth`,
  };
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const { slug } = await params;
  const itinerary = await resolveItinerary(slug);
  const nextItineraries = buildNextItineraries(slug, itinerary);
  const accentColor = normalizeItineraryAccentHex(itinerary.accentColor);
  const accentStyle: CSSProperties | undefined = accentColor
    ? ({ "--color-itinerary-accent": accentColor } as CSSProperties)
    : undefined;

  return (
    <main
      className="itinerary-scale flex w-full flex-col items-center"
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
