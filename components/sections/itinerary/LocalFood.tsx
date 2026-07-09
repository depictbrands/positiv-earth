import Image from "next/image";

import type { ItineraryLocalFoodContent } from "@/types/itinerary-local-food-content";

const PLACEHOLDER_HERO =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 937 593"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23c4783a"/><stop offset="1" stop-color="%235a2f18"/></linearGradient></defs><rect width="937" height="593" fill="url(%23g)"/></svg>';

const PLACEHOLDER_GALLERY = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 322"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%238b5a2b"/><stop offset="1" stop-color="%23332211"/></linearGradient></defs><rect width="459" height="322" fill="url(%23g)"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 322"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%235a8f4a"/><stop offset="1" stop-color="%231f3a18"/></linearGradient></defs><rect width="459" height="322" fill="url(%23g)"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 322"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%233d8a8a"/><stop offset="1" stop-color="%231a4040"/></linearGradient></defs><rect width="459" height="322" fill="url(%23g)"/></svg>',
] as const;

const DEFAULT_CONTENT: ItineraryLocalFoodContent = {
  heading: "Culinary Immersion",
  tagline: "A taste of Peru, told through its land and its people.",
  body: "Peruvian cuisine is a love letter to the land — born from Andean highlands, Amazon rivers, and Pacific coasts. From smoky anticuchos sizzling over open coals to tamales steamed in banana leaves, every dish carries a story of family, geography, and generations of culinary know-how.",
  heroImage: {
    imageUrl: PLACEHOLDER_HERO,
    imageAlt: "Anticuchos and potatoes sizzling on a street grill",
  },
  galleryImages: [
    {
      imageUrl: PLACEHOLDER_GALLERY[0],
      imageAlt: "Food wrapped in banana leaves grilling over open coals",
    },
    {
      imageUrl: PLACEHOLDER_GALLERY[1],
      imageAlt: "Hands folding tamales in bright green leaves",
    },
    {
      imageUrl: PLACEHOLDER_GALLERY[2],
      imageAlt: "A bowl of Peruvian ceviche with lime and cilantro",
    },
  ],
};

type LocalFoodProps = {
  content?: ItineraryLocalFoodContent;
};

function resolveImage(
  image: ItineraryLocalFoodContent["heroImage"] | undefined,
  fallbackUrl: string,
  fallbackAlt: string,
) {
  return {
    imageUrl: image?.imageUrl?.trim() || fallbackUrl,
    imageAlt: image?.imageAlt?.trim() || fallbackAlt,
  };
}

function resolveContent(content?: ItineraryLocalFoodContent): ItineraryLocalFoodContent {
  const gallery =
    content?.galleryImages?.length === 3
      ? content.galleryImages
      : DEFAULT_CONTENT.galleryImages;

  return {
    heading: content?.heading?.trim() || DEFAULT_CONTENT.heading,
    tagline: content?.tagline?.trim() || DEFAULT_CONTENT.tagline,
    body: content?.body?.trim() || DEFAULT_CONTENT.body,
    heroImage: resolveImage(
      content?.heroImage,
      DEFAULT_CONTENT.heroImage.imageUrl,
      DEFAULT_CONTENT.heroImage.imageAlt,
    ),
    galleryImages: gallery.map((item, index) =>
      resolveImage(
        item,
        DEFAULT_CONTENT.galleryImages[index]?.imageUrl ?? PLACEHOLDER_GALLERY[0],
        DEFAULT_CONTENT.galleryImages[index]?.imageAlt ?? "Local food",
      ),
    ),
  };
}

// Itinerary "LocalFood" section (Figma node 584:1221): on a white canvas, a
// copy column (heading, tagline, body) sits beside a large hero food photo, with
// a three-image gallery row below. Presentational — content arrives via props.
export default function LocalFood({ content }: LocalFoodProps) {
  const resolved = resolveContent(content);

  return (
    <section
      aria-labelledby="itinerary-local-food-heading"
      className="w-full overflow-hidden bg-secondary-black"
    >
      <div
        className="mx-auto flex w-full max-w-[var(--size-itinerary-overview-width)] flex-col px-6 py-16 sm:px-10 lg:px-0 lg:py-22"
        style={{ gap: "var(--spacing-itinerary-local-food-section-gap)" }}
      >
        {/* Top row: copy + hero image */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-5">
          <div
            className="flex w-full flex-col items-center text-center lg:w-[var(--size-itinerary-local-food-copy-width)] lg:items-start lg:text-left"
            style={{ gap: "var(--spacing-itinerary-local-food-copy-gap)" }}
          >
            <div
              className="flex w-full flex-col items-center lg:items-start"
              style={{ gap: "var(--spacing-itinerary-local-food-heading-gap)" }}
            >
              <h2
                id="itinerary-local-food-heading"
                className="font-display text-heading-4 uppercase text-base-white"
              >
                {resolved.heading}
              </h2>
              <p className="font-body font-light text-p1 text-base-white">
                {resolved.tagline}
              </p>
            </div>

            <p className="font-body text-itinerary-local-food-body text-base-white">
              {resolved.body}
            </p>
          </div>

          <div className="relative aspect-[937/593] w-full overflow-hidden rounded-card-corner lg:aspect-auto lg:h-[var(--size-itinerary-local-food-hero-height)] lg:w-[var(--size-itinerary-card-width)] lg:shrink-0">
            <Image
              src={resolved.heroImage.imageUrl}
              alt={resolved.heroImage.imageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 937px, 100vw"
            />
          </div>
        </div>

        {/* Gallery row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resolved.galleryImages.map((image, index) => (
            <div
              key={`${image.imageAlt}-${index}`}
              className="relative aspect-[459/322] w-full overflow-hidden rounded-card-corner lg:aspect-auto lg:h-[var(--size-itinerary-local-food-gallery-height)] lg:w-full lg:max-w-[var(--size-itinerary-local-food-gallery-width)]"
            >
              <Image
                src={image.imageUrl}
                alt={image.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 459px, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
