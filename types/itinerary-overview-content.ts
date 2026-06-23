/**
 * Content shape for the Itinerary "Overview" section (Figma node 584:1098):
 * an "Expedition Overview" heading + accordion panels, a route map image, and
 * the multi-step process timeline. Plain serializable fields so it maps cleanly
 * onto a Sanity `itinerary` document later.
 */

export type ItineraryProcessStep = {
  title: string;
  description: string;
};

export type ItineraryOverviewAccordionItem = {
  title: string;
  body: string;
};

export type ItineraryOverviewContent = {
  heading: string;
  /** Expandable overview panels beside the route map. */
  accordionItems: ItineraryOverviewAccordionItem[];
  mapImageUrl: string;
  mapImageAlt: string;
  /** Ordered process timeline steps (Connect → Reflect). */
  process: ItineraryProcessStep[];
};
