import type { SanityImageSource } from "@sanity/image-url";

import type { BrandStoryContent } from "@/types/brand-story-content";
import type { CTAContent } from "@/types/cta-content";
import type { Destination } from "@/types/destination";
import type { DestinationsSectionContent } from "@/types/destinations-section-content";
import type { HeroContent } from "@/types/hero-content";
import type {
  HowItWorksContent,
  HowItWorksSteps,
} from "@/types/how-it-works-content";
import type {
  Testimonial,
  TestimonialSectionContent,
} from "@/types/testimonial-section-content";

import { urlFor } from "./image";

type SanityImageWithAlt = {
  asset?: SanityImageSource;
  alt?: string;
};

type SanityHomePage = {
  hero?: {
    headlinePre?: string;
    headlineEmphasis?: string;
    headlinePost?: string;
    subcopy?: string;
    backgroundImage?: SanityImageWithAlt;
  };
  brandStory?: {
    heading?: string;
    emphasizedWord?: string;
    body?: string[];
    image?: SanityImageWithAlt;
    cta?: { label?: string; href?: string };
  };
  howItWorks?: {
    heading?: string;
    emphasizedWord?: string;
    steps?: string[];
    body?: string;
    image?: SanityImageWithAlt;
    cta?: { label?: string; href?: string };
  };
  destinations?: {
    heading?: string;
    destinations?: Array<{
      name?: string;
      durationDays?: number;
      locations?: string[];
      href?: string;
      image?: SanityImageWithAlt;
    }>;
  };
  testimonial?: {
    heading?: string;
    testimonials?: Array<{
      name?: string;
      quote?: string;
      avatar?: SanityImageWithAlt;
    }>;
  };
  cta?: {
    heading?: string;
    buttonLabel?: string;
    buttonHref?: string;
    image?: SanityImageWithAlt;
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

function mapCta(cta?: { label?: string; href?: string }) {
  const label = cta?.label?.trim();

  if (!label) {
    return undefined;
  }

  return {
    label,
    href: cta?.href?.trim() || "#",
  };
}

function mapHero(hero: NonNullable<SanityHomePage["hero"]>): HeroContent {
  const background = mapImage(hero.backgroundImage);

  return {
    headline: {
      pre: hero.headlinePre ?? "",
      emphasis: hero.headlineEmphasis ?? "",
      post: hero.headlinePost ?? "",
    },
    subcopy: hero.subcopy ?? "",
    backgroundImageUrl: background?.imageUrl ?? "",
    backgroundImageAlt: background?.imageAlt ?? "",
  };
}

function mapBrandStory(
  section: NonNullable<SanityHomePage["brandStory"]>,
): BrandStoryContent {
  const image = mapImage(section.image);

  return {
    heading: section.heading ?? "",
    emphasizedWord: section.emphasizedWord,
    body: section.body ?? [],
    imageUrl: image?.imageUrl,
    imageAlt: image?.imageAlt,
    cta: mapCta(section.cta),
  };
}

function mapHowItWorks(
  section: NonNullable<SanityHomePage["howItWorks"]>,
): HowItWorksContent {
  const image = mapImage(section.image);
  const steps = (section.steps ?? []).slice(0, 5);

  while (steps.length < 5) {
    steps.push("");
  }

  return {
    heading: section.heading ?? "",
    emphasizedWord: section.emphasizedWord,
    steps: steps as HowItWorksSteps,
    body: section.body ?? "",
    imageUrl: image?.imageUrl,
    imageAlt: image?.imageAlt,
    cta: mapCta(section.cta),
  };
}

function mapDestination(
  destination: NonNullable<
    NonNullable<SanityHomePage["destinations"]>["destinations"]
  >[number],
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

function mapDestinations(
  section: NonNullable<SanityHomePage["destinations"]>,
): DestinationsSectionContent {
  return {
    heading: section.heading ?? "",
    destinations: (section.destinations ?? []).map(mapDestination),
  };
}

function mapTestimonial(
  item: NonNullable<
    NonNullable<SanityHomePage["testimonial"]>["testimonials"]
  >[number],
): Testimonial {
  const avatar = mapImage(item.avatar);

  return {
    name: item.name ?? "",
    quote: item.quote ?? "",
    avatarUrl: avatar?.imageUrl ?? "",
    avatarAlt: avatar?.imageAlt ?? "",
  };
}

function mapTestimonialSection(
  section: NonNullable<SanityHomePage["testimonial"]>,
): TestimonialSectionContent {
  return {
    heading: section.heading,
    testimonials: (section.testimonials ?? []).map(mapTestimonial),
  };
}

function mapCtaSection(
  section: NonNullable<SanityHomePage["cta"]>,
): CTAContent {
  const image = mapImage(section.image);

  return {
    heading: section.heading ?? "",
    buttonLabel: section.buttonLabel ?? "",
    buttonHref: section.buttonHref?.trim() || "/contact",
    imageUrl: image?.imageUrl ?? "",
    imageAlt: image?.imageAlt ?? "",
  };
}

export type HomePageContent = {
  hero: HeroContent;
  brandStory: BrandStoryContent;
  howItWorks: HowItWorksContent;
  destinations: DestinationsSectionContent;
  testimonial: TestimonialSectionContent;
  cta: CTAContent;
};

export function mapHomePage(data: SanityHomePage | null): HomePageContent | null {
  if (
    !data?.hero ||
    !data.brandStory ||
    !data.howItWorks ||
    !data.destinations ||
    !data.testimonial ||
    !data.cta
  ) {
    return null;
  }

  return {
    hero: mapHero(data.hero),
    brandStory: mapBrandStory(data.brandStory),
    howItWorks: mapHowItWorks(data.howItWorks),
    destinations: mapDestinations(data.destinations),
    testimonial: mapTestimonialSection(data.testimonial),
    cta: mapCtaSection(data.cta),
  };
}
