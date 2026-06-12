import Image from "next/image";
import Link from "next/link";

import type { Destination } from "@/types/destination";

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 650"><defs><linearGradient id="g" x1="0" x2="0.9" y1="0" y2="1"><stop stop-color="%236b8f8f"/><stop offset="1" stop-color="%23181818"/></linearGradient></defs><rect width="342" height="650" fill="url(%23g)"/></svg>';

type DestinationCardProps = {
  destination: Destination;
  orientation?: "landscape" | "portrait";
  /** Home grid uses mixed portrait/landscape sizes; next-itinerary uses uniform cards. */
  layout?: "home" | "next-itinerary";
};

function DestinationCardContent({
  destination,
  orientation = "portrait",
}: DestinationCardProps) {
  const locations = destination.locations.join(", ");
  const isPortrait = orientation === "portrait";
  const imageUrl = destination.imageUrl?.trim() || PLACEHOLDER_IMAGE;
  const imageAlt = destination.imageAlt?.trim() || destination.name;

  return (
    <article className="relative h-full w-full overflow-hidden rounded-card-corner">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 w-full"
        style={{
          height: isPortrait
            ? "var(--size-destination-card-portrait-overlay-height)"
            : "var(--size-destination-card-landscape-overlay-height)",
          borderRadius:
            "0 0 var(--radius-card-corner) var(--radius-card-corner)",
          backgroundImage:
            "linear-gradient(0deg, var(--color-destination-card-portrait-overlay-start) 50%, var(--color-destination-card-portrait-overlay-end) 87.08%)",
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-start"
        style={{
          gap: "var(--spacing-destination-card-copy-gap)",
          paddingInline: "var(--spacing-destination-card-copy-inset)",
          paddingBottom: "var(--spacing-destination-card-copy-inset)",
          width:
            "calc(100% - (var(--spacing-destination-card-copy-inset) * 2))",
          maxWidth: "var(--size-destination-card-copy-width)",
        }}
      >
        <div
          className="flex w-full flex-col items-start"
          style={{ gap: "var(--spacing-destination-card-title-gap)" }}
        >
          <div
            className="flex items-end text-base-white"
            style={{ gap: "var(--spacing-destination-card-header-gap)" }}
          >
            <h3
              className={`font-display text-destination-card-title uppercase text-base-white ${
                isPortrait ? "min-w-0 flex-1" : "whitespace-nowrap"
              }`}
              style={
                isPortrait
                  ? { maxWidth: "var(--size-destination-card-title-width)" }
                  : undefined
              }
            >
              {destination.name}
            </h3>

            <span
              aria-hidden="true"
              className="block w-px shrink-0 self-end bg-destination-card-divider"
              style={{
                height: "var(--size-destination-card-vertical-divider-height)",
              }}
            />

            <span className="inline-flex shrink-0 items-end text-base-white">
              <span className="font-display text-destination-card-duration leading-none">
                {destination.durationDays}
              </span>
              <span
                className="font-open-sans text-destination-card-duration-label leading-none"
                style={{
                  marginLeft:
                    "var(--spacing-destination-card-duration-label-offset-x)",
                }}
              >
                DAYS
              </span>
            </span>
          </div>
        </div>

        <p className="w-full font-open-sans text-destination-card-locations text-base-white">
          {locations}
        </p>
      </div>
    </article>
  );
}

export default function DestinationCard({
  destination,
  orientation = "portrait",
  layout = "home",
}: DestinationCardProps) {
  const isNextItinerary = layout === "next-itinerary";
  const copyOrientation = isNextItinerary ? "portrait" : orientation;

  const sizeClass = isNextItinerary
    ? "aspect-[458/530] w-full min-w-0"
    : orientation === "landscape"
      ? "aspect-[701/650] max-w-[var(--size-destination-card-landscape-width)]"
      : "aspect-[342/650] max-w-[var(--size-destination-card-portrait-width)]";

  const boxClass = isNextItinerary
    ? `block w-full min-w-0 ${sizeClass}`
    : `block w-full mx-auto lg:max-w-none ${sizeClass}`;

  const card = (
    <DestinationCardContent
      destination={destination}
      orientation={copyOrientation}
      layout={layout}
    />
  );

  if (!destination.href) {
    return <div className={boxClass}>{card}</div>;
  }

  return (
    <Link
      href={destination.href}
      className={`${boxClass} focus-visible:rounded-card-corner focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white`}
    >
      {card}
    </Link>
  );
}
