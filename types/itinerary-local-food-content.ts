/**
 * Content shape for the Itinerary "LocalFood" section (Figma node 584:1221):
 * a culinary heading, tagline, body copy, a hero food photo, and a row of
 * gallery images. Plain serializable fields for a future Sanity `itinerary`
 * document.
 */

export type ItineraryLocalFoodImage = {
  imageUrl: string;
  imageAlt: string;
};

export type ItineraryLocalFoodContent = {
  heading: string;
  tagline: string;
  body: string;
  heroImage: ItineraryLocalFoodImage;
  galleryImages: ItineraryLocalFoodImage[];
};
