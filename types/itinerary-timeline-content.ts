/**
 * Content shape for the Itinerary "ItineraryTimeline" section (Figma node
 * 584:1122): a heading plus an ordered list of day entries. Each day has a rail
 * label/summary and a media card (date, headline, body, photo, Details link).
 * Plain serializable fields so it maps cleanly onto a Sanity `itinerary`
 * document later.
 */

/** One time-of-day block inside a day's detail modal (Morning/Afternoon/Evening). */
export type ItineraryDayPeriod = {
  /** Period name, e.g. "Morning". */
  name: string;
  /** Meal line, e.g. "Breakfast" or "Don't include lunch". */
  meal: string;
  /** Optional meal location (rendered italic), e.g. "Hotel in Cusco". */
  mealPlace?: string;
  /** Whether the meal is included — drives the accent vs. neutral styling. */
  mealIncluded?: boolean;
  /** Activity description for the period. */
  activity: string;
};

/** Expanded day plan shown in the "Details" pop-up (Figma node 584:1758). */
export type ItineraryDayDetail = {
  /** Location label shown next to the day, e.g. "Cusco". */
  city: string;
  /** Ordered time-of-day blocks (typically Morning / Afternoon / Evening). */
  periods: ItineraryDayPeriod[];
};

export type ItineraryDay = {
  /** Rail label, e.g. "DAY 1". */
  dayLabel: string;
  /** Short rail summary; newlines render as separate lines. */
  daySummary: string;
  /** Card date, e.g. "OCT 22, 2026". */
  date: string;
  /** Card headline, e.g. "Welcome to Cusco". */
  headline: string;
  /** Card body paragraph. */
  body: string;
  imageUrl: string;
  imageAlt: string;
  /** Expanded day plan opened by the "Details" button. */
  detail?: ItineraryDayDetail;
};

export type ItineraryTimelineContent = {
  heading: string;
  days: ItineraryDay[];
};
