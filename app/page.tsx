import BrandStory from "@/components/sections/home/BrandStory";
import CTA from "@/components/sections/home/CTA";
import Destinations from "@/components/sections/home/Destinations";
import Hero from "@/components/sections/home/Hero";
import HowItWorks from "@/components/sections/home/HowItWorks";
import Testimonial from "@/components/sections/home/Testimonial";
import { client } from "@/sanity/lib/client";
import { mapHomePage } from "@/sanity/lib/mapHomePage";
import {
  HOME_PAGE_QUERY,
  ITINERARY_SLUGS_QUERY,
} from "@/sanity/lib/queries";

export default async function Home() {
  const [sanityHomePage, itinerarySlugRows] = await Promise.all([
    client ? client.fetch(HOME_PAGE_QUERY) : null,
    client ? client.fetch(ITINERARY_SLUGS_QUERY) : null,
  ]);

  const content = mapHomePage(sanityHomePage);
  // Only pass the published-slug allowlist when Sanity is wired — DestinationCard
  // already skips the Link when href is cleared for unpublished itineraries.
  const publishedItinerarySlugs = client
    ? ((itinerarySlugRows ?? []) as Array<{ slug?: string }>)
        .map((row) => row.slug?.trim())
        .filter((slug): slug is string => Boolean(slug))
    : undefined;

  return (
    <main className="home-scale flex w-full flex-col items-center">
      <Hero content={content?.hero} />
      <BrandStory content={content?.brandStory} />
      <HowItWorks content={content?.howItWorks} />
      <Destinations
        content={content?.destinations}
        publishedItinerarySlugs={publishedItinerarySlugs}
      />
      <Testimonial content={content?.testimonial} />
      <CTA content={content?.cta} />
    </main>
  );
}
