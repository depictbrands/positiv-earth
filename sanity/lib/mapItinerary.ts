import type { SanityImageSource } from "@sanity/image-url";

import type { ItineraryAccommodationContent } from "@/types/itinerary-accommodation-content";
import type {
  ItineraryContent,
  ItineraryNextItinerariesConfig,
} from "@/types/itinerary-content";
import type { ItineraryHeroContent } from "@/types/itinerary-hero-content";
import type { ItineraryLocalFoodContent } from "@/types/itinerary-local-food-content";
import type { ItineraryOverviewContent } from "@/types/itinerary-overview-content";
import type {
  ItineraryDay,
  ItineraryDayDetail,
  ItineraryDayPeriod,
  ItineraryTimelineContent,
} from "@/types/itinerary-timeline-content";
import type { ItineraryWhatsIncludedContent } from "@/types/itinerary-whats-included-content";

import { urlFor } from "./image";

type SanityImageWithAlt = {
  asset?: SanityImageSource;
  alt?: string;
};

type SanityItinerary = {
  title?: string;
  slug?: string;
  accentColor?: string;
  hero?: {
    country?: string;
    title?: string;
    durationDays?: number;
    nights?: number;
    travelers?: number;
    backgroundImage?: SanityImageWithAlt;
  };
  overview?: {
    heading?: string;
    accordionItems?: Array<{ title?: string; body?: string }>;
    mapImage?: SanityImageWithAlt;
    process?: Array<{ title?: string; description?: string }>;
  };
  timeline?: {
    heading?: string;
    days?: Array<{
      dayLabel?: string;
      daySummary?: string;
      date?: string;
      headline?: string;
      body?: string;
      image?: SanityImageWithAlt;
      detail?: {
        city?: string;
        periods?: Array<{
          name?: string;
          meal?: string;
          mealPlace?: string;
          mealIncluded?: boolean;
          activity?: string;
        }>;
      };
    }>;
  };
  localFood?: {
    heading?: string;
    tagline?: string;
    body?: string;
    heroImage?: SanityImageWithAlt;
    galleryImages?: SanityImageWithAlt[];
  };
  accommodation?: {
    heading?: string;
    cities?: Array<{
      id?: string;
      label?: string;
      hotels?: Array<{
        name?: string;
        image?: SanityImageWithAlt;
      }>;
    }>;
  };
  whatsIncluded?: {
    heading?: string;
    includesHeading?: string;
    notIncludesHeading?: string;
    includes?: string[];
    notIncludes?: string[];
  };
  nextItineraries?: {
    headingLeading?: string;
    headingTrailing?: string;
    editorialSlugs?: string[];
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

function mapHero(hero: NonNullable<SanityItinerary["hero"]>): ItineraryHeroContent {
  const background = mapImage(hero.backgroundImage);

  return {
    country: hero.country ?? "",
    title: hero.title ?? "",
    durationDays: hero.durationDays ?? 0,
    nights: hero.nights ?? 0,
    travelers: hero.travelers ?? 0,
    backgroundImageUrl: background?.imageUrl ?? "",
    backgroundImageAlt: background?.imageAlt ?? "",
  };
}

function mapOverview(
  section: NonNullable<SanityItinerary["overview"]>,
): ItineraryOverviewContent {
  const mappedMapImage = mapImage(section.mapImage);

  return {
    heading: section.heading ?? "",
    accordionItems: (section.accordionItems ?? []).map((item) => ({
      title: item.title ?? "",
      body: item.body ?? "",
    })),
    mapImageUrl: mappedMapImage?.imageUrl ?? "",
    mapImageAlt: mappedMapImage?.imageAlt ?? "",
    process: (section.process ?? []).map((step) => ({
      title: step.title ?? "",
      description: step.description ?? "",
    })),
  };
}

function mapDayPeriod(period: {
  name?: string;
  meal?: string;
  mealPlace?: string;
  mealIncluded?: boolean;
  activity?: string;
}): ItineraryDayPeriod {
  return {
    name: period.name ?? "",
    meal: period.meal ?? "",
    mealPlace: period.mealPlace?.trim() || undefined,
    mealIncluded: period.mealIncluded,
    activity: period.activity ?? "",
  };
}

function mapDayDetail(detail: {
  city?: string;
  periods?: Array<{
    name?: string;
    meal?: string;
    mealPlace?: string;
    mealIncluded?: boolean;
    activity?: string;
  }>;
}): ItineraryDayDetail {
  return {
    city: detail.city ?? "",
    periods: (detail.periods ?? []).map(mapDayPeriod),
  };
}

function mapDay(
  day: NonNullable<NonNullable<SanityItinerary["timeline"]>["days"]>[number],
): ItineraryDay {
  const image = mapImage(day.image);

  return {
    dayLabel: day.dayLabel ?? "",
    daySummary: day.daySummary ?? "",
    date: day.date ?? "",
    headline: day.headline ?? "",
    body: day.body ?? "",
    imageUrl: image?.imageUrl ?? "",
    imageAlt: image?.imageAlt ?? "",
    detail: day.detail ? mapDayDetail(day.detail) : undefined,
  };
}

function mapTimeline(
  section: NonNullable<SanityItinerary["timeline"]>,
): ItineraryTimelineContent {
  return {
    heading: section.heading ?? "",
    days: (section.days ?? []).map(mapDay),
  };
}

function mapLocalFood(
  section: NonNullable<SanityItinerary["localFood"]>,
): ItineraryLocalFoodContent {
  const heroImage = mapImage(section.heroImage);

  return {
    heading: section.heading ?? "",
    tagline: section.tagline ?? "",
    body: section.body ?? "",
    heroImage: {
      imageUrl: heroImage?.imageUrl ?? "",
      imageAlt: heroImage?.imageAlt ?? "",
    },
    galleryImages: (section.galleryImages ?? []).flatMap((image) => {
      const mapped = mapImage(image);
      return mapped ? [mapped] : [];
    }),
  };
}

function mapAccommodation(
  section: NonNullable<SanityItinerary["accommodation"]>,
): ItineraryAccommodationContent {
  return {
    heading: section.heading ?? "",
    cities: (section.cities ?? []).map((city) => ({
      id: city.id ?? "",
      label: city.label ?? "",
      hotels: (city.hotels ?? []).map((hotel) => {
        const image = mapImage(hotel.image);
        return {
          name: hotel.name ?? "",
          imageUrl: image?.imageUrl ?? "",
          imageAlt: image?.imageAlt ?? "",
        };
      }),
    })),
  };
}

function mapWhatsIncluded(
  section: NonNullable<SanityItinerary["whatsIncluded"]>,
): ItineraryWhatsIncludedContent {
  return {
    heading: section.heading ?? "",
    includesHeading: section.includesHeading ?? "",
    notIncludesHeading: section.notIncludesHeading ?? "",
    includes: section.includes ?? [],
    notIncludes: section.notIncludes ?? [],
  };
}

function mapNextItineraries(
  section: NonNullable<SanityItinerary["nextItineraries"]>,
): ItineraryNextItinerariesConfig {
  return {
    headingLeading: section.headingLeading ?? "",
    headingTrailing: section.headingTrailing ?? "",
    editorialSlugs: section.editorialSlugs?.length
      ? section.editorialSlugs
      : undefined,
  };
}

export { mapDestination } from "./mapDestination";

export function mapItinerary(
  data: SanityItinerary | null,
): ItineraryContent | null {
  if (!data?.hero) {
    return null;
  }

  return {
    hero: mapHero(data.hero),
    accentColor: data.accentColor?.trim() || undefined,
    overview: data.overview ? mapOverview(data.overview) : undefined,
    timeline: data.timeline ? mapTimeline(data.timeline) : undefined,
    localFood: data.localFood ? mapLocalFood(data.localFood) : undefined,
    accommodation: data.accommodation
      ? mapAccommodation(data.accommodation)
      : undefined,
    whatsIncluded: data.whatsIncluded
      ? mapWhatsIncluded(data.whatsIncluded)
      : undefined,
    nextItineraries: data.nextItineraries
      ? mapNextItineraries(data.nextItineraries)
      : undefined,
  };
}
