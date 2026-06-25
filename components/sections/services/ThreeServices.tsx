"use client";

import { useLayoutEffect, useRef } from "react";

import { initPhotoReveal } from "@/lib/photoReveal";
import type {
  Service,
  ThreeServicesContent,
} from "@/types/three-services-content";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const DEFAULT_COACHING_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1216 678"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%2390c6e8"/><stop offset="0.5" stop-color="%23b9a06a"/><stop offset="1" stop-color="%23556b3a"/></linearGradient></defs><rect width="1216" height="678" fill="url(%23g)"/><path d="M0 300C180 230 360 250 540 200C720 150 900 200 1216 140V678H0Z" fill="%23e9eef2" fill-opacity="0.35"/><path d="M0 420C200 370 420 400 620 360C840 315 1020 350 1216 320V678H0Z" fill="%235f7a3c"/></svg>';

const DEFAULT_BOOKING_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1216 678"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23bfe0f2"/><stop offset="0.6" stop-color="%23a99b86"/><stop offset="1" stop-color="%236b6256"/></linearGradient></defs><rect width="1216" height="678" fill="url(%23g)"/><rect x="120" y="360" width="980" height="220" fill="%238a8073" fill-opacity="0.6"/><path d="M0 470C220 440 460 470 700 440C940 410 1080 440 1216 420V678H0Z" fill="%23577a3e"/></svg>';

const DEFAULT_ASSISTANCE_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1216 678"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stop-color="%23a9d4ef"/><stop offset="0.5" stop-color="%237bae6a"/><stop offset="1" stop-color="%2335552c"/></linearGradient></defs><rect width="1216" height="678" fill="url(%23g)"/><path d="M0 280C200 220 420 250 640 210C860 170 1040 210 1216 170V678H0Z" fill="%235f8a45"/><path d="M0 430C220 390 460 420 700 390C940 360 1080 390 1216 370V678H0Z" fill="%2335552c"/></svg>';

const DEFAULT_CONTENT: ThreeServicesContent = {
  services: [
    {
      title: "Customized Coaching",
      description:
        "Guided, one-on-one preparation tailored to your destination, needs, and travel style.",
      imageUrl: DEFAULT_COACHING_IMAGE,
      imageAlt: "Andean valley with grazing llamas beneath snow-capped peaks",
    },
    {
      title: "Personalized Booking",
      description:
        "Thoughtfully planned and handled travel arrangements designed around you.",
      imageUrl: DEFAULT_BOOKING_IMAGE,
      imageAlt: "Ancient stone ruins along a grassy hillside path",
    },
    {
      title: "Curated Assistance",
      description:
        "Ongoing support with practical insights, tools, and real-life guidance every step of the way.",
      imageUrl: DEFAULT_ASSISTANCE_IMAGE,
      imageAlt: "Terraced green valley framed by mountains",
    },
  ],
};

// Caption-card swatches, cycled by row order (Figma olive / blue / coral).
const CARD_COLORS = [
  "var(--color-three-services-olive)",
  "var(--color-three-services-blue)",
  "var(--color-three-services-coral)",
];

type ServiceRowProps = {
  service: Service;
  cardColor: string;
  // Even rows mirror the layout: photo to the right, caption card overlapping
  // the photo's inner edge from the left.
  reversed?: boolean;
  // Keep the title on a single line on desktop (mobile cards still wrap).
  noWrapTitle?: boolean;
};

function ServiceRow({
  service,
  cardColor,
  reversed = false,
  noWrapTitle = false,
}: ServiceRowProps) {
  const photoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => initPhotoReveal(photoRef.current), []);

  return (
    <article className="relative flex w-full flex-col">
      {/* Photo — full width on mobile; on desktop ~76% of the 1512 frame, hugging
          one margin so the caption card can overhang the opposite edge. */}
      <div
        ref={photoRef}
        className={cn(
          "relative z-0 aspect-[1150/678] w-full overflow-hidden rounded-[var(--radius-card-corner)]",
          reversed
            ? "lg:ml-auto lg:mr-[1.59%] lg:w-[75.99%]"
            : "lg:ml-[1.59%] lg:w-[76.26%]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.imageUrl}
          alt={service.imageAlt}
          className="block h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-three-services-image-overlay)]"
        />
      </div>

      {/* Caption card — stacks full-width below the photo on mobile and is
          vertically centered over the photo's inner edge on desktop. */}
      <div
        className={cn(
          "relative z-10 mt-[var(--spacing-three-services-card-stack-gap)] flex w-full min-h-[var(--size-three-services-card-min-height)] flex-col justify-center items-start rounded-[var(--radius-card-corner)] px-[var(--spacing-three-services-card-pad-x)] py-[var(--spacing-three-services-card-pad-y)] text-left lg:absolute lg:top-1/2 lg:mt-0 lg:w-[60%] lg:max-w-[var(--size-three-services-card-width)] lg:-translate-y-1/2",
          reversed
            ? "lg:left-[1.59%] lg:items-end lg:text-right"
            : "lg:right-[1.59%]",
        )}
        style={{ backgroundColor: cardColor }}
      >
        <div
          className={cn(
            "flex w-full flex-col items-start gap-[var(--spacing-three-services-caption-gap)]",
            reversed && "lg:items-end",
          )}
        >
          <h3
            className={cn(
              "font-display text-heading-4 text-base-black",
              noWrapTitle && "lg:whitespace-nowrap",
            )}
          >
            {service.title}
          </h3>
          {/* Body keeps the narrow cap; the heading uses full card width and
              shares the same edge as the body via the wrapper's alignment. */}
          <p className="w-full font-body text-turntable-tag text-base-black lg:max-w-[var(--size-three-services-text-width)]">
            {service.description}
          </p>
        </div>
      </div>
    </article>
  );
}

type ThreeServicesProps = {
  content?: ThreeServicesContent;
};

export default function ThreeServices({
  content = DEFAULT_CONTENT,
}: ThreeServicesProps) {
  const services = content.services?.length
    ? content.services
    : DEFAULT_CONTENT.services;

  return (
    <section aria-label="Our services" className="w-full bg-secondary-black">
      <div className="mx-auto flex w-full max-w-[var(--size-three-services-width)] flex-col gap-[var(--spacing-three-services-row-gap-mobile)] px-6 pt-[var(--spacing-three-services-top)] pb-[var(--spacing-three-services-bottom)] sm:px-8 lg:gap-[var(--spacing-three-services-row-gap)] lg:px-0">
        {services.map((service, index) => (
          <ServiceRow
            key={`${service.title}-${index}`}
            service={service}
            cardColor={CARD_COLORS[index % CARD_COLORS.length]}
            reversed={index % 2 === 1}
            noWrapTitle={index < 2}
          />
        ))}
      </div>
    </section>
  );
}
