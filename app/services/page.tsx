import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/sections/services/ServicesHero";
import ThreeServices from "@/components/sections/services/ThreeServices";
import { client } from "@/sanity/lib/client";
import { mapServicesPage } from "@/sanity/lib/mapServicesPage";
import { SERVICES_PAGE_QUERY } from "@/sanity/lib/queries";

export default async function ServicesPage() {
  const sanityServicesPage = client
    ? await client.fetch(SERVICES_PAGE_QUERY)
    : null;

  const content = mapServicesPage(sanityServicesPage);

  return (
    <main className="services-scale flex w-full flex-col items-center">
      <ServicesHero content={content?.hero} />
      <ThreeServices content={content?.threeServices} />
      <Footer />
    </main>
  );
}
