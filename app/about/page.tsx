import AboutHero from "@/components/sections/AboutHero";
import Footer from "@/components/layout/Footer";
import { client } from "@/sanity/lib/client";
import { mapAboutPage } from "@/sanity/lib/mapAboutPage";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";

export default async function AboutPage() {
  const sanityAboutPage = client ? await client.fetch(ABOUT_PAGE_QUERY) : null;

  const content = mapAboutPage(sanityAboutPage);

  return (
    <main className="flex w-full flex-col items-center">
      <AboutHero content={content?.hero} />
      <Footer />
    </main>
  );
}
