import type { DestinationsSectionContent } from "@/types/destinations-section-content";

import { mapDestination, type SanityDestinationFields } from "./mapDestination";

export type SanityDestinationsSection = {
  heading?: string;
  allTripsHeading?: string;
  featuredDestinations?: SanityDestinationFields[];
};

export function mapDestinationsSection(
  section: SanityDestinationsSection,
): DestinationsSectionContent {
  return {
    heading: section.heading ?? "",
    allTripsHeading: section.allTripsHeading ?? "",
    destinations: (section.featuredDestinations ?? [])
      .filter(Boolean)
      .map(mapDestination),
  };
}
