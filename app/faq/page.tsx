import Footer from "@/components/layout/Footer";
import FAQ from "@/components/sections/faq/FAQ";
import FAQHero from "@/components/sections/faq/FAQHero";
import { client } from "@/sanity/lib/client";
import { mapFaqPage } from "@/sanity/lib/mapFaqPage";
import { FAQ_PAGE_QUERY } from "@/sanity/lib/queries";

export default async function FAQPage() {
  const sanityFaqPage = client ? await client.fetch(FAQ_PAGE_QUERY) : null;

  const content = mapFaqPage(sanityFaqPage);

  return (
    <main className="faq-scale flex w-full flex-col items-center">
      <FAQHero content={content?.hero} />
      <FAQ content={content?.faq} />
      <Footer />
    </main>
  );
}
