import type { FaqContent, FaqItem } from "@/types/faq-content";
import type { FaqHeroContent } from "@/types/faq-hero-content";

import { mapHeroImage, type SanityHeroImage } from "./mapHeroImage";

type SanityFaqPage = {
  hero?: {
    headline?: string;
    backgroundImage?: SanityHeroImage;
  };
  faq?: {
    heading?: string;
    items?: Array<{
      question?: string;
      answer?: string;
    }>;
  };
};

function mapHero(
  hero: NonNullable<SanityFaqPage["hero"]>,
): FaqHeroContent {
  return {
    headline: hero.headline ?? "",
    ...mapHeroImage(hero.backgroundImage),
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
