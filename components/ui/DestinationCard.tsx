import Image from "next/image";
import Link from "next/link";

import type { Destination } from "@/types/destination";

type DestinationCardProps = {
  destination: Destination;
  orientation: "landscape" | "portrait";
};

function DestinationCardContent({
  destination,
  orientation,
}: DestinationCardProps) {
  const locations = destination.locations.join(", ");
  const isPortrait = orientation === "portrait";

  return (
    <article
      className="relative h-full w-full overflow-hidden rounded-card-corner"
    >
      <Image
        src={destination.imageUrl}
        alt={destination.imageAlt}
        fill
        className="object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to top, var(--color-destination-card-scrim), transparent)",
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
              style={{ height: "var(--size-destination-card-vertical-divider-height)" }}
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

          <div className="w-full border-t border-destination-card-divider" />
        </div>

        <p className="w-full font-open-sans text-destination-card-locations italic text-base-white">
          {locations}
        </p>
      </div>
    </article>
  );
}

export default function DestinationCard(props: DestinationCardProps) {
  const sizeClass =
    props.orientation === "landscape"
      ? "aspect-[701/650] max-w-[var(--size-destination-card-landscape-width)]"
      : "aspect-[342/650] max-w-[var(--size-destination-card-portrait-width)]";
  const boxClass = `block w-full mx-auto lg:max-w-none ${sizeClass}`;

  if (!props.destination.href) {
    return (
      <div className={boxClass}>
        <DestinationCardContent {...props} />
      </div>
    );
  }

  return (
    <Link
      href={props.destination.href}
      className={`${boxClass} focus-visible:rounded-card-corner focus-visible:outline focus-visible:outline-2 focus-visible:outline-base-white`}
    >
      <DestinationCardContent {...props} />
    </Link>
  );
}
