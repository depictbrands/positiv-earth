/**
 * Content shape for the Itinerary "Overview" section (Figma node 584:1098):
 * an "Expedition Overview" heading + highlight bullets, a route map image, and
 * the multi-step process timeline. Plain serializable fields so it maps cleanly
 * onto a Sanity `itinerary` document later.
 */

export type ItineraryProcessStep = {
  title: string;
  description: string;
};

export type ItineraryOverviewContent = {
  heading: string;
  /** Highlight bullets, e.g. "Original Inca Trail hike". */
  highlights: string[];
  mapImageUrl: string;
  mapImageAlt: string;
  /** Ordered process timeline steps (Connect → Reflect). */
  process: ItineraryProcessStep[];
};
