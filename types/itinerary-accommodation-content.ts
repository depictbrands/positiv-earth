/**
 * Content shape for the Itinerary "Accommodation" section (Figma node 584:1231):
 * a heading, a list of city tabs, and per-city hotel cards. Plain serializable
 * fields for a future Sanity `itinerary` document.
 */

export type ItineraryHotel = {
  name: string;
  imageUrl: string;
  imageAlt: string;
};

export type ItineraryAccommodationCity = {
  /** Stable id for tab selection, e.g. "cusco". */
  id: string;
  /** Tab label, e.g. "Cusco Hotels". */
  label: string;
  /** Hotels for this city — first item renders as the large featured card. */
  hotels: ItineraryHotel[];
};

export type ItineraryAccommodationContent = {
  heading: string;
  cities: ItineraryAccommodationCity[];
};
