import Footer from "@/components/layout/Footer";
import BrandStory from "@/components/sections/home/BrandStory";
import CTA from "@/components/sections/home/CTA";
import Destinations from "@/components/sections/home/Destinations";
import Hero from "@/components/sections/home/Hero";
import HowItWorks from "@/components/sections/home/HowItWorks";
import Testimonial from "@/components/sections/home/Testimonial";
import { client } from "@/sanity/lib/client";
import { mapHomePage } from "@/sanity/lib/mapHomePage";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";

export default async function Home() {
  const sanityHomePage = client
    ? await client.fetch(HOME_PAGE_QUERY)
    : null;

  const content = mapHomePage(sanityHomePage);

  return (
    <main className="home-scale flex w-full flex-col items-center">
      <Hero content={content?.hero} />
      <BrandStory content={content?.brandStory} />
      <HowItWorks content={content?.howItWorks} />
      <Destinations content={content?.destinations} />
      <Testimonial content={content?.testimonial} />
      <CTA content={content?.cta} />
      <Footer />
    </main>
  );
}
