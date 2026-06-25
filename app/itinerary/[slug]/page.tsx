import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

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
import { slugFromItineraryHref } from "@/lib/itinerary/recommendNextItineraries";
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

function normalizeDestinationName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

const DEFAULT_DESTINATIONS_BY_SLUG = new Map<string, Destination>(
  DEFAULT_DESTINATIONS.flatMap((destination) => {
    const slug = slugFromItineraryHref(destination.href);
    return slug ? [[slug, destination] as const] : [];
  }),
);

const DEFAULT_DESTINATIONS_BY_NAME = new Map<string, Destination>(
  DEFAULT_DESTINATIONS.map(
    (destination) =>
      [normalizeDestinationName(destination.name), destination] as const,
  ),
);

function findDefaultDestinationFallback(
  destination: Destination,
): Destination | undefined {
  const slug = slugFromItineraryHref(destination.href);
  if (slug) {
    const bySlug = DEFAULT_DESTINATIONS_BY_SLUG.get(slug);
    if (bySlug) return bySlug;
  }

  return DEFAULT_DESTINATIONS_BY_NAME.get(
    normalizeDestinationName(destination.name),
  );
}

function mergeDestinationFields(
  primary: Destination,
  secondary: Destination,
): Destination {
  return {
    name: primary.name?.trim() || secondary.name,
    durationDays: primary.durationDays || secondary.durationDays,
    locations: primary.locations.length
      ? primary.locations
      : secondary.locations,
    href: primary.href?.trim() || secondary.href,
    imageUrl: primary.imageUrl?.trim() || secondary.imageUrl,
    imageAlt:
      primary.imageAlt?.trim() || secondary.imageAlt?.trim() || secondary.name,
  };
}

function enrichDestinationWithFallback(destination: Destination): Destination {
  const fallback = findDefaultDestinationFallback(destination);
  return fallback ? mergeDestinationFields(destination, fallback) : destination;
}

function destinationPoolKey(destination: Destination): string {
  const slug = slugFromItineraryHref(destination.href);
  if (slug) return slug;

  return normalizeDestinationName(destination.name);
}

/** Sanity picks first; local defaults fill gaps so Next Itineraries never dead-ends. */
function mergeDestinationPools(...pools: Destination[][]): Destination[] {
  const merged = new Map<string, Destination>();

  for (const pool of pools) {
    for (const destination of pool) {
      const key = destinationPoolKey(destination);
      const existing = merged.get(key);
      merged.set(
        key,
        existing
          ? mergeDestinationFields(existing, destination)
          : destination,
      );
    }
  }

  return Array.from(merged.values());
}

async function fetchDestinations(): Promise<Destination[]> {
  if (!client) {
    return DEFAULT_DESTINATIONS;
  }

  const sanityDestinations = await client.fetch(HOME_DESTINATIONS_QUERY);
  const mapped = (sanityDestinations ?? []).map(mapDestination);
  const fromSanity = mapped.map(enrichDestinationWithFallback);

  return mergeDestinationPools(fromSanity, DEFAULT_DESTINATIONS);
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
  const allDestinations = mergeDestinationPools(
    (configured?.destinations ?? []).map(enrichDestinationWithFallback),
    (itinerary.destinations ?? []).map(enrichDestinationWithFallback),
    DEFAULT_DESTINATIONS,
  ).filter((destination) => Boolean(slugFromItineraryHref(destination.href)));
  const destinations = allDestinations.filter(
    (destination) => slugFromItineraryHref(destination.href) !== slug,
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
    </main>
  );
}
