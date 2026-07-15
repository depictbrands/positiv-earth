import type { Destination } from "@/types/destination";

export type DestinationsSectionContent = {
  heading: string;
  /** Heading for the /destinations page (Sanity-managed). */
  allTripsHeading: string;
  destinations: Destination[];
};
