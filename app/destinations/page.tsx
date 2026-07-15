import Destinations from "@/components/sections/home/Destinations";
import { client } from "@/sanity/lib/client";
import { mapDestination } from "@/sanity/lib/mapDestination";
import { mapHomePage } from "@/sanity/lib/mapHomePage";
import {
  ALL_DESTINATIONS_QUERY,
  HOME_PAGE_QUERY,
  ITINERARY_SLUGS_QUERY,
} from "@/sanity/lib/queries";

export const metadata = {
  title: "Destinations | Positiv Earth",
  description: "Browse all Positiv Earth destinations and itineraries.",
};

export default async function DestinationsPage() {
  const [sanityHomePage, allDestinationRows, itinerarySlugRows] =
    await Promise.all([
      client ? client.fetch(HOME_PAGE_QUERY) : null,
      client ? client.fetch(ALL_DESTINATIONS_QUERY) : null,
      client ? client.fetch(ITINERARY_SLUGS_QUERY) : null,
    ]);

  const content = mapHomePage(sanityHomePage);
  const publishedItinerarySlugs = client
    ? ((itinerarySlugRows ?? []) as Array<{ slug?: string }>)
        .map((row) => row.slug?.trim())
        .filter((slug): slug is string => Boolean(slug))
    : undefined;

  const allDestinations = (allDestinationRows ?? []).map(mapDestination);
  const pageHeading =
    content?.destinations.allTripsHeading?.trim() || "All Trips";

  return (
    <main className="home-scale flex w-full flex-col items-center">
      <Destinations
        content={{
          heading: content?.destinations.heading ?? "",
          allTripsHeading: content?.destinations.allTripsHeading ?? "",
          destinations: allDestinations,
        }}
        publishedItinerarySlugs={publishedItinerarySlugs}
        headingOverride={pageHeading}
      />
    </main>
  );
}
