import type { HeroBackgroundImage } from "./hero-background-image";

/**
 * Content shape for the Itinerary page hero (Figma node 584:1071).
 *
 * Plain serializable fields so it maps cleanly onto a Sanity `itinerary`
 * document later: a country eyebrow, the trip title, the duration / traveller
 * counts that compose the meta line, and the resolved background image.
 */
export type ItineraryHeroContent = {
  /** Country eyebrow shown above the title, e.g. "Peru". */
  country: string;
  /** Trip title, e.g. "Cusco, Machu Picchu". */
  title: string;
  /** Number of days, drives the "{n} days" portion of the meta line. */
  durationDays: number;
  /** Number of nights, drives the "{n} nights" portion of the meta line. */
  nights: number;
  /** Number of travellers, drives the "{n} travelers" portion of the meta line. */
  travelers: number;
} & HeroBackgroundImage;
