/** Maximum viewed-itinerary slugs kept for recommendation scoring. */
const MAX_VIEWED_SLUGS = 10;

const VIEWED_ITINERARIES_KEY = "positiv-earth:viewed-itinerary-slugs";
const QUIZ_AFFINITY_KEY = "positiv-earth:quiz-itinerary-affinity-slugs";

function readJsonArray(key: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function writeJsonArray(key: string, values: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(values));
}

/** Slugs the visitor has opened on `/itinerary/[slug]`, most recent first. */
export function readViewedItinerarySlugs(): string[] {
  return readJsonArray(VIEWED_ITINERARIES_KEY);
}

/** Record an itinerary page view for future recommendations. */
export function recordItineraryView(slug: string): void {
  const trimmed = slug.trim();
  if (!trimmed) return;

  const viewed = readViewedItinerarySlugs();
  const next = [trimmed, ...viewed.filter((item) => item !== trimmed)].slice(
    0,
    MAX_VIEWED_SLUGS,
  );
  writeJsonArray(VIEWED_ITINERARIES_KEY, next);
}

/**
 * Slugs inferred from quiz answers once the quiz persists a profile (see
 * DesignYourTravelQuiz submit). Empty until that seam is wired.
 */
export function readQuizAffinitySlugs(): string[] {
  return readJsonArray(QUIZ_AFFINITY_KEY);
}

/** Called when quiz submission maps answers → itinerary slugs. */
export function saveQuizAffinitySlugs(slugs: string[]): void {
  writeJsonArray(
    QUIZ_AFFINITY_KEY,
    slugs.filter((slug) => slug.trim()).slice(0, MAX_VIEWED_SLUGS),
  );
}
