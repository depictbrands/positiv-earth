import type { SanityImageSource } from "@sanity/image-url";

import type { Destination } from "@/types/destination";

import { urlFor } from "./image";

type SanityImageWithAlt = {
  asset?: SanityImageSource;
  alt?: string;
};

export type SanityDestinationFields = {
  _id?: string;
  name?: string;
  durationDays?: number;
  locations?: string[];
  href?: string;
  image?: SanityImageWithAlt;
};

function mapImage(image?: SanityImageWithAlt) {
  if (!image?.asset) {
    return undefined;
  }

  try {
    return {
      imageUrl: urlFor(image.asset).url(),
      imageAlt: image.alt?.trim() || "",
    };
  } catch {
    return undefined;
  }
}

export function mapDestination(
  destination: SanityDestinationFields,
): Destination {
  const image = mapImage(destination.image);

  return {
    name: destination.name ?? "",
    durationDays: destination.durationDays ?? 0,
    locations: destination.locations ?? [],
    imageUrl: image?.imageUrl ?? "",
    imageAlt: image?.imageAlt ?? "",
    href: destination.href,
  };
}
