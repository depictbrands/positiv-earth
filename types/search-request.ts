/**
 * The JSON payload the home-page search bar POSTs to `/api/search-request`.
 *
 * There is no destination database yet, so submitting a search simply routes the
 * traveller to the featured destinations section. This payload captures what
 * they were looking for as a lead the advisor team can triage in Sanity Studio
 * (persisted as a `searchRequest` document).
 */
export type SearchRequestPayload = {
  where: string;
  what: string;
  /** Trip window start as a local `YYYY-MM-DD` date, or null if not chosen. */
  dateFrom: string | null;
  /** Trip window end as a local `YYYY-MM-DD` date, or null if not chosen. */
  dateTo: string | null;
};
