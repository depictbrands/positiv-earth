import type { SanityImageSource } from "@sanity/image-url";

import type { AboutHeroContent } from "@/types/about-hero-content";

import { urlFor } from "./image";

type SanityImageWithAlt = {
  asset?: SanityImageSource;
  alt?: string;
};

type SanityAboutPage = {
  hero?: {
    lead?: string;
    name?: string;
    role?: string;
    backgroundImage?: SanityImageWithAlt;
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
  hero: NonNullable<SanityAboutPage["hero"]>,
): AboutHeroContent {
  const background = mapImage(hero.backgroundImage);

  return {
    lead: hero.lead ?? "",
    name: hero.name ?? "",
    role: hero.role ?? "",
    backgroundImageUrl: background?.imageUrl ?? "",
    backgroundImageAlt: background?.imageAlt ?? "",
  };
}

export type AboutPageContent = {
  hero: AboutHeroContent;
};

export function mapAboutPage(
  data: SanityAboutPage | null,
): AboutPageContent | null {
  if (!data?.hero) {
    return null;
  }

  return {
    hero: mapHero(data.hero),
  };
}
