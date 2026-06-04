import type { SanityImageSource } from "@sanity/image-url";

import type { FaqContent, FaqItem } from "@/types/faq-content";
import type { FaqHeroContent } from "@/types/faq-hero-content";

import { urlFor } from "./image";

type SanityImageWithAlt = {
  asset?: SanityImageSource;
  alt?: string;
};

type SanityFaqPage = {
  hero?: {
    headline?: string;
    backgroundImage?: SanityImageWithAlt;
  };
  faq?: {
    heading?: string;
    items?: Array<{
      question?: string;
      answer?: string;
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
  hero: NonNullable<SanityFaqPage["hero"]>,
): FaqHeroContent {
  const background = mapImage(hero.backgroundImage);

  return {
    headline: hero.headline ?? "",
    backgroundImageUrl: background?.imageUrl ?? "",
    backgroundImageAlt: background?.imageAlt ?? "",
  };
}

function mapItem(
  item: NonNullable<NonNullable<SanityFaqPage["faq"]>["items"]>[number],
): FaqItem {
  return {
    question: item.question ?? "",
    answer: item.answer ?? "",
  };
}

function mapFaq(section: NonNullable<SanityFaqPage["faq"]>): FaqContent {
  return {
    heading: section.heading ?? "",
    items: (section.items ?? []).map(mapItem),
  };
}

export type FaqPageContent = {
  hero?: FaqHeroContent;
  faq?: FaqContent;
};

export function mapFaqPage(data: SanityFaqPage | null): FaqPageContent | null {
  if (!data) {
    return null;
  }

  const result: FaqPageContent = {};

  if (data.hero) {
    result.hero = mapHero(data.hero);
  }

  if (data.faq) {
    result.faq = mapFaq(data.faq);
  }

  if (!result.hero && !result.faq) {
    return null;
  }

  return result;
}
