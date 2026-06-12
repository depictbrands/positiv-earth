import Link from "next/link";

import DestinationCard from "@/components/ui/DestinationCard";
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
    href: "/itinerary/cusco-machu-picchu",
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

const DEFAULT_CONTENT: DestinationsSectionContent = {
  heading: "Our Featured Destinations",
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
};

export default function Destinations({
  content = DEFAULT_CONTENT,
}: DestinationsProps) {
  const firstRow = content.destinations.slice(0, 3);
  const secondRow = content.destinations.slice(3, 6);

  return (
    <section className="w-full overflow-hidden bg-base-white">
      <div className="mx-auto flex w-full max-w-[var(--size-destinations-grid-width)] flex-col items-center px-6 py-20 sm:px-10 lg:px-0 lg:py-[var(--spacing-destinations-heading-offset-top)]">
        <h2 className="text-center font-display text-heading-4 text-base-black">
          {content.heading}
        </h2>

        <div
          className="mt-12 flex w-full flex-col lg:mt-24"
          style={{ gap: "var(--spacing-destinations-grid-gap-y)" }}
        >
          <div
            className="grid grid-cols-1 justify-items-center lg:[grid-template-columns:342fr_342fr_701fr] lg:justify-items-stretch"
            style={{ gap: "var(--spacing-destinations-grid-gap-x-sm)" }}
          >
            {firstRow.map((destination, index) => (
              <DestinationCard
                key={`${destination.name}-${index}`}
                destination={destination}
                orientation={GRID_ORIENTATIONS[index]}
              />
            ))}
          </div>

          <div
            className="grid grid-cols-1 justify-items-center lg:[grid-template-columns:701fr_342fr_342fr] lg:justify-items-stretch"
            style={{ gap: "var(--spacing-destinations-grid-gap-x-lg)" }}
          >
            {secondRow.map((destination, index) => (
              <DestinationCard
                key={`${destination.name}-${index + 3}`}
                destination={destination}
                orientation={GRID_ORIENTATIONS[index + 3]}
              />
            ))}
          </div>
        </div>

        <Link
          href="#"
          className="mt-12 inline-flex items-center justify-center rounded-search-button-corner border font-body text-cta-button transition-opacity hover:opacity-80 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-ink-base)] lg:mt-20"
          style={{
            width: "var(--size-destinations-cta-width)",
            height: "var(--size-destinations-cta-height)",
            color: "var(--color-ink-base)",
            borderColor: "var(--color-ink-base)",
          }}
        >
          All Trips
        </Link>
      </div>
    </section>
  );
}
