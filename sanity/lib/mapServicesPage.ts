import type { SanityImageSource } from "@sanity/image-url";

import type { ServicesHeroContent } from "@/types/services-hero-content";
import type {
  Service,
  ThreeServicesContent,
} from "@/types/three-services-content";

import { urlFor } from "./image";

type SanityImageWithAlt = {
  asset?: SanityImageSource;
  alt?: string;
};

type SanityServicesPage = {
  hero?: {
    headline?: string;
    backgroundImage?: SanityImageWithAlt;
  };
  threeServices?: {
    services?: Array<{
      title?: string;
      description?: string;
      image?: SanityImageWithAlt;
    }>;
  };
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

function mapHero(
  hero: NonNullable<SanityServicesPage["hero"]>,
): ServicesHeroContent {
  const background = mapImage(hero.backgroundImage);

  return {
    headline: hero.headline ?? "",
    backgroundImageUrl: background?.imageUrl ?? "",
    backgroundImageAlt: background?.imageAlt ?? "",
  };
}

function mapService(
  service: NonNullable<
    NonNullable<SanityServicesPage["threeServices"]>["services"]
  >[number],
): Service {
  const image = mapImage(service.image);

  return {
    title: service.title ?? "",
    description: service.description ?? "",
    imageUrl: image?.imageUrl ?? "",
    imageAlt: image?.imageAlt ?? "",
  };
}

function mapThreeServices(
  section: NonNullable<SanityServicesPage["threeServices"]>,
): ThreeServicesContent {
  return {
    services: (section.services ?? []).map(mapService),
  };
}

export type ServicesPageContent = {
  hero: ServicesHeroContent;
  threeServices: ThreeServicesContent;
};

export function mapServicesPage(
  data: SanityServicesPage | null,
): ServicesPageContent | null {
  if (!data?.hero || !data.threeServices) {
    return null;
  }

  return {
    hero: mapHero(data.hero),
    threeServices: mapThreeServices(data.threeServices),
  };
}
