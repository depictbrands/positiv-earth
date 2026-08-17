import type { SanityImageSource } from "@sanity/image-url";

import type { BrandStoryContent } from "@/types/brand-story-content";
import type { CTAContent } from "@/types/cta-content";
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

import {
  mapDestinationsSection,
  type SanityDestinationsSection,
} from "./mapDestinations";
import { urlFor } from "./image";
import { mapHeroImage, type SanityHeroImage } from "./mapHeroImage";

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
    backgroundImage?: SanityHeroImage;
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
    // Tolerant of legacy string steps and the current {title, body} objects so
    // the page keeps rendering while CMS content is migrated to the new shape.
    steps?: Array<string | { title?: string; body?: string } | null>;
    body?: string;
    image?: SanityImageWithAlt;
    cta?: { label?: string; href?: string };
  };
  destinations?: SanityDestinationsSection;
  testimonial?: {
    heading?: string;
    testimonials?: Array<{
      name?: string;
      video?: { asset?: { url?: string } };
      poster?: SanityImageWithAlt;
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
  return {
    headline: {
      pre: hero.headlinePre ?? "",
      emphasis: hero.headlineEmphasis ?? "",
      post: hero.headlinePost ?? "",
    },
    subcopy: hero.subcopy ?? "",
    ...mapHeroImage(hero.backgroundImage),
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
  const steps = (section.steps ?? []).slice(0, 5).map((step) =>
    typeof step === "string"
      ? { title: step, body: "" }
      : { title: step?.title ?? "", body: step?.body ?? "" },
  );

  while (steps.length < 5) {
    steps.push({ title: "", body: "" });
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

function mapTestimonial(
  item: NonNullable<
    NonNullable<SanityHomePage["testimonial"]>["testimonials"]
  >[number],
): Testimonial {
  const poster = mapImage(item.poster);

  return {
    name: item.name?.trim() || undefined,
    videoUrl: item.video?.asset?.url ?? "",
    posterUrl: poster?.imageUrl,
    alt: item.name?.trim() || "Customer testimonial video",
  };
}

function mapTestimonialSection(
  section: NonNullable<SanityHomePage["testimonial"]>,
): TestimonialSectionContent {
  return {
    heading: section.heading,
    testimonials: (section.testimonials ?? [])
      .map(mapTestimonial)
      .filter((testimonial) => testimonial.videoUrl),
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
    destinations: mapDestinationsSection(data.destinations),
    testimonial: mapTestimonialSection(data.testimonial),
    cta: mapCtaSection(data.cta),
  };
}
