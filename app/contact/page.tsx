import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/sections/contact/ContactHero";
import ContactInfo from "@/components/sections/contact/ContactInfo";
import { client } from "@/sanity/lib/client";
import { mapContactPage } from "@/sanity/lib/mapContactPage";
import { CONTACT_PAGE_QUERY } from "@/sanity/lib/queries";

export default async function ContactPage() {
  const sanityContactPage = client
    ? await client.fetch(CONTACT_PAGE_QUERY)
    : null;

  const content = mapContactPage(sanityContactPage);

  return (
    <main className="flex w-full flex-col items-center">
      <ContactHero content={content?.hero} />
      <ContactInfo content={content?.info} />
      <Footer />
    </main>
  );
}
