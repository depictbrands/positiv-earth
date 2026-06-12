/**
 * Content shape for the Itinerary "WhatsIncluded" section (Figma node 584:1298):
 * a heading plus two columns of included / not-included bullet lists. Plain
 * serializable fields for a future Sanity `itinerary` document.
 */

export type ItineraryWhatsIncludedContent = {
  heading: string;
  includesHeading: string;
  notIncludesHeading: string;
  includes: string[];
  notIncludes: string[];
};
