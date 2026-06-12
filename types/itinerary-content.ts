import type { ItineraryAccommodationContent } from "@/types/itinerary-accommodation-content";
import type { ItineraryHeroContent } from "@/types/itinerary-hero-content";
import type { ItineraryLocalFoodContent } from "@/types/itinerary-local-food-content";
import type { ItineraryOverviewContent } from "@/types/itinerary-overview-content";
import type { ItineraryTimelineContent } from "@/types/itinerary-timeline-content";
import type { ItineraryNextItinerariesContent } from "@/types/itinerary-next-itineraries-content";
import type { ItineraryWhatsIncludedContent } from "@/types/itinerary-whats-included-content";
import type { Destination } from "@/types/destination";

/**
 * Top-level shape for one itinerary document (maps to a Sanity `itinerary`
 * document by slug). Section content is grouped here; the page/data layer
 * fetches and maps Sanity → this type, then passes sections down.
 */
export type ItineraryContent = {
  hero: ItineraryHeroContent;
  overview?: ItineraryOverviewContent;
  timeline?: ItineraryTimelineContent;
  localFood?: ItineraryLocalFoodContent;
  accommodation?: ItineraryAccommodationContent;
  whatsIncluded?: ItineraryWhatsIncludedContent;
  nextItineraries?: ItineraryNextItinerariesContent;
  /** Shared home-page destination list — used to build nextItineraries when not set explicitly. */
  destinations?: Destination[];
  /**
   * Destination accent color as a hex string (e.g. "#cf3030" for Peru).
   * Drives `--color-itinerary-accent` on the itinerary page so timeline rails,
   * active day labels, and detail-modal meal highlights match the destination.
   */
  accentColor?: string;
};

/** Accepts "#RGB", "#RRGGBB", or bare "RRGGBB" from Sanity; returns "#rrggbb". */
export function normalizeItineraryAccentHex(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(withHash)) {
    const [, r, g, b] = withHash;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(withHash)) {
    return withHash.toLowerCase();
  }

  return undefined;
}
