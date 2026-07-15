import Link from "next/link";

import DestinationCard from "@/components/ui/DestinationCard";
import { slugFromItineraryHref } from "@/lib/itinerary/recommendNextItineraries";
import type { Destination } from "@/types/destination";
import type { DestinationsSectionContent } from "@/types/destinations-section-content";

const PLACEHOLDER_IMAGES = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 650"><defs><linearGradient id="g" x1="0" x2="0.9" y1="0" y2="1"><stop stop-color="%236b8f8f"/><stop offset="1" stop-color="%23181818"/></linearGradient></defs><rect width="342" height="650" fill="url(%23g)"/><rect x="0" y="420" width="342" height="230" fill="%23000000" fill-opacity="0.18"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 650"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%2337805b"/><stop offset="1" stop-color="%230c1f1e"/></linearGradient></defs><rect width="342" height="650" fill="url(%23g)"/><rect x="0" y="420" width="342" height="230" fill="%23000000" fill-opacity="0.18"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 701 650"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%2399adc0"/><stop offset="1" stop-color="%233d4653"/></linearGradient></defs><rect width="701" height="650" fill="url(%23g)"/><rect x="0" y="430" width="701" height="220" fill="%23000000" fill-opacity="0.18"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 701 650"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%2396a9b8"/><stop offset="1" stop-color="%23404040"/></linearGradient></defs><rect width="701" height="650" fill="url(%23g)"/><rect x="0" y="430" width="701" height="220" fill="%23000000" fill-opacity="0.18"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 650"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23a44a1f"/><stop offset="1" stop-color="%232a120a"/></linearGradient></defs><rect width="342" height="650" fill="url(%23g)"/><rect x="0" y="420" width="342" height="230" fill="%23000000" fill-opacity="0.18"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 343 650"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23a79a86"/><stop offset="1" stop-color="%23373935"/></linearGradient></defs><rect width="343" height="650" fill="url(%23g)"/><rect x="0" y="420" width="343" height="230" fill="%23000000" fill-opacity="0.18"/></svg>',
] as const;

export const DEFAULT_DESTINATIONS: Destination[] = [
  {
    name: "Vietname",
    durationDays: 8,
    locations: ["Hanoi", "Halong Bay", "Hoi an", "Ho Minh City"],
    imageUrl: PLACEHOLDER_IMAGES[0],
    imageAlt: "Vietnam destination placeholder",
    href: "/itinerary/vietnam",
  },
  {
    name: "Costa Rica",
    durationDays: 7,
    locations: ["San José", "Arenal", "Manuel Antonio"],
    imageUrl: PLACEHOLDER_IMAGES[1],
    imageAlt: "Costa Rica destination placeholder",
    href: "/itinerary/costa-rica",
  },
  {
    name: "Puerto Rico",
    durationDays: 5,
    locations: ["San Juan", "El Yunque", "Vieques"],
    imageUrl: PLACEHOLDER_IMAGES[2],
    imageAlt: "Puerto Rico destination placeholder",
    href: "/itinerary/puerto-rico",
  },
  {
    name: "Cusco Classic",
    durationDays: 6,
    locations: ["Cusco", "Machu Picchu", "Vinicunca"],
    imageUrl: PLACEHOLDER_IMAGES[3],
    imageAlt: "Cusco Classic destination placeholder",
    href: "/itinerary/peru-machu-picchu",
  },
  {
    name: "Japan Classic",
    durationDays: 9,
    locations: ["Tokyo", "Hakone", "Kyoto", "Nara", "Hiroshima"],
    imageUrl: PLACEHOLDER_IMAGES[4],
    imageAlt: "Japan Classic destination placeholder",
    href: "/itinerary/japan-classic",
  },
  {
    name: "Sacred Valley",
    durationDays: 5,
    locations: ["Lima", "Sacred Valley", "Lake Titicaca", "Machu Picchu"],
    imageUrl: PLACEHOLDER_IMAGES[5],
    imageAlt: "Sacred Valley destination placeholder",
    href: "/itinerary/sacred-valley",
  },
];

export const HOME_FEATURED_DESTINATION_COUNT = 6;

const DEFAULT_CONTENT: DestinationsSectionContent = {
  heading: "Our Featured Destinations",
  allTripsHeading: "All Trips",
  destinations: DEFAULT_DESTINATIONS,
};

const GRID_ORIENTATIONS: Array<"portrait" | "landscape"> = [
  "portrait",
  "portrait",
  "landscape",
  "landscape",
  "portrait",
  "portrait",
];

type DestinationsProps = {
  content?: DestinationsSectionContent;
  /**
   * When provided (Sanity-backed site), only cards whose `/itinerary/<slug>` is
   * in this list stay linked. Others render as static cards so they never 404.
   * Omit when Sanity is not configured so local fallback routes still work.
   */
  publishedItinerarySlugs?: readonly string[];
  /** Where the mosaic layout index starts. */
  layoutIndexOffset?: number;
  /** Cap how many cards render; home uses 6. Omit for unlimited. */
  maxDestinations?: number;
  /** Override the section heading (destinations page uses CMS `allTripsHeading`). */
  headingOverride?: string;
  /** Home section only — links to /destinations. */
  showAllTripsCta?: boolean;
};

/** Drop hrefs that don't point at a published itinerary slug. */
function withPublishedLinksOnly(
  destinations: Destination[],
  publishedSlugs: ReadonlySet<string>,
): Destination[] {
  return destinations.map((destination) => {
    const slug = slugFromItineraryHref(destination.href);
    if (slug && publishedSlugs.has(slug)) {
      return destination;
    }
    return { ...destination, href: undefined };
  });
}

function chunkIntoRows<T>(items: T[], rowSize = 3): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += rowSize) {
    rows.push(items.slice(i, i + rowSize));
  }
  return rows;
}

function rowGridClass(globalRowIndex: number) {
  return globalRowIndex % 2 === 0
    ? "lg:[grid-template-columns:342fr_342fr_701fr]"
    : "lg:[grid-template-columns:701fr_342fr_342fr]";
}

function rowGapStyle(globalRowIndex: number) {
  return {
    gap:
      globalRowIndex % 2 === 0
        ? "var(--spacing-destinations-grid-gap-x-sm)"
        : "var(--spacing-destinations-grid-gap-x-lg)",
  };
}

export default function Destinations({
  content = DEFAULT_CONTENT,
  publishedItinerarySlugs,
  layoutIndexOffset = 0,
  maxDestinations,
  headingOverride,
  showAllTripsCta = false,
}: DestinationsProps) {
  const destinations =
    publishedItinerarySlugs === undefined
      ? content.destinations
      : withPublishedLinksOnly(
          content.destinations,
          new Set(publishedItinerarySlugs),
        );

  const visible =
    maxDestinations === undefined
      ? destinations
      : destinations.slice(0, maxDestinations);
  const rows = chunkIntoRows(visible);
  const heading = headingOverride?.trim() || content.heading;

  return (
    <section
      id="destinations"
      aria-labelledby="destinations-heading"
      className="w-full scroll-mt-[var(--size-header-height)] overflow-hidden bg-secondary-black"
    >
      <div className="mx-auto flex w-full max-w-[var(--size-destinations-grid-width)] flex-col items-center px-6 py-20 sm:px-10 lg:px-0 lg:py-[var(--spacing-destinations-heading-offset-top)]">
        <h2
          id="destinations-heading"
          className="text-center font-display text-heading-4 text-base-white"
        >
          {heading}
        </h2>

        {rows.length > 0 ? (
          <div
            className="mt-12 flex w-full flex-col lg:mt-24"
            style={{ gap: "var(--spacing-destinations-grid-gap-y)" }}
          >
            {rows.map((row, rowIndex) => {
              const globalRowIndex = Math.floor(
                (layoutIndexOffset + rowIndex * 3) / 3,
              );

              return (
                <div
                  key={globalRowIndex}
                  className={`grid w-full grid-cols-1 justify-items-stretch ${rowGridClass(globalRowIndex)} lg:justify-items-stretch`}
                  style={rowGapStyle(globalRowIndex)}
                >
                  {row.map((destination, colIndex) => {
                    const globalIndex =
                      layoutIndexOffset + rowIndex * 3 + colIndex;

                    return (
                      <DestinationCard
                        key={`${destination.name}-${globalIndex}`}
                        destination={destination}
                        orientation={
                          GRID_ORIENTATIONS[globalIndex % GRID_ORIENTATIONS.length]
                        }
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : null}

        {showAllTripsCta ? (
          <Link
            href="/destinations"
            className="focus-ring-white mt-12 inline-flex h-[var(--size-destinations-cta-height)] w-[var(--size-destinations-cta-width)] items-center justify-center rounded-search-button-corner border border-base-white font-body text-cta-button text-base-white transition-opacity hover:opacity-80 active:opacity-70 lg:mt-20"
          >
            All Trips
          </Link>
        ) : null}
      </div>
    </section>
  );
}
