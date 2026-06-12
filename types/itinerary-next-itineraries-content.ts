import type { Destination } from "@/types/destination";

/**
 * Content shape for the Itinerary "NextItineraries" section (Figma node 584:1248):
 * a two-line heading plus a row of uniform destination cards sourced from the
 * home-page destination list. Plain serializable fields for Sanity.
 */
export type ItineraryNextItinerariesContent = {
  headingLeading: string;
  headingTrailing: string;
  /** Full home-page destination pool; the section picks two from this list. */
  destinations: Destination[];
  /**
   * Optional CMS picks (itinerary slugs). Highest priority in recommendation
   * scoring — use for curated "you may also like" pairs per destination.
   */
  editorialSlugs?: string[];
};
