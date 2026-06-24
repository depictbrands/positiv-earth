import type { Destination } from "@/types/destination";

import {
  readQuizAffinitySlugs,
  readViewedItinerarySlugs,
} from "@/lib/itinerary/behaviorStore";

/** Exactly two cards are shown in the Next Itineraries section (Figma 584:1248). */
export const NEXT_ITINERARY_RECOMMENDATION_COUNT = 2;

export type RecommendNextItinerariesInput = {
  destinations: Destination[];
  currentSlug: string;
  /** CMS/editorial picks — highest priority when present. */
  editorialSlugs?: string[];
  /** Override for tests or server-side hints; defaults to localStorage readers. */
  viewedSlugs?: string[];
  quizAffinitySlugs?: string[];
};

export function slugFromItineraryHref(href?: string): string | undefined {
  if (!href) return undefined;
  const match = href.match(/^\/itinerary\/([^/?#]+)/);
  return match?.[1];
}

function scoreDestination(
  destination: Destination,
  slug: string,
  input: RecommendNextItinerariesInput,
  viewedSlugs: string[],
  quizAffinitySlugs: string[],
  editorialSlugs: string[],
): number {
  if (slug === input.currentSlug) return Number.NEGATIVE_INFINITY;

  let score = 0;

  const editorialIndex = editorialSlugs.indexOf(slug);
  if (editorialIndex >= 0) {
    score += 100 - editorialIndex;
  }

  const affinityIndex = quizAffinitySlugs.indexOf(slug);
  if (affinityIndex >= 0) {
    score += 50 - affinityIndex;
  }

  if (!viewedSlugs.includes(slug)) {
    score += 20;
  } else {
    score -= 5;
  }

  return score;
}

/**
 * Picks two itinerary recommendations from the home destination pool.
 *
 * Priority (highest first):
 * 1. Editorial slugs from Sanity (`editorialSlugs` on the itinerary document)
 * 2. Quiz affinity slugs (localStorage once quiz submission persists them)
 * 3. Destinations the visitor has not opened yet
 * 4. Stable list order as tie-breaker
 *
 * Without behavior data, falls back to the first two destinations excluding
 * the current page.
 */
export function recommendNextItineraries(
  input: RecommendNextItinerariesInput,
): Destination[] {
  const viewedSlugs = input.viewedSlugs ?? readViewedItinerarySlugs();
  const quizAffinitySlugs =
    input.quizAffinitySlugs ?? readQuizAffinitySlugs();
  const editorialSlugs = input.editorialSlugs ?? [];

  const candidates = input.destinations
    .map((destination, index) => {
      const slug = slugFromItineraryHref(destination.href);
      if (!slug) return null;

      return {
        destination,
        slug,
        index,
        score: scoreDestination(
          destination,
          slug,
          input,
          viewedSlugs,
          quizAffinitySlugs,
          editorialSlugs,
        ),
      };
    })
    .filter(
      (
        item,
      ): item is {
        destination: Destination;
        slug: string;
        index: number;
        score: number;
      } => item !== null && Number.isFinite(item.score),
    )
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    });

  return candidates
    .slice(0, NEXT_ITINERARY_RECOMMENDATION_COUNT)
    .map((item) => item.destination);
}

/** Deterministic fallback for SSR / first paint (no localStorage). */
export function pickNextItinerariesFallback(
  destinations: Destination[],
  currentSlug: string,
  limit = NEXT_ITINERARY_RECOMMENDATION_COUNT,
): Destination[] {
  return destinations
    .filter((destination) => {
      const slug = slugFromItineraryHref(destination.href);
      return Boolean(slug) && slug !== currentSlug;
    })
    .slice(0, limit);
}
