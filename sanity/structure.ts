import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home page")
        .id("homePage")
        .child(
          S.document().schemaType("homePage").documentId("homePage"),
        ),
      S.listItem()
        .title("Logo")
        .id("logo")
        .child(S.document().schemaType("logo").documentId("logo")),
      S.listItem()
        .title("Services page")
        .id("servicesPage")
        .child(
          S.document().schemaType("servicesPage").documentId("servicesPage"),
        ),
      S.listItem()
        .title("FAQ page")
        .id("faqPage")
        .child(S.document().schemaType("faqPage").documentId("faqPage")),
      S.listItem()
        .title("Contact page")
        .id("contactPage")
        .child(
          S.document().schemaType("contactPage").documentId("contactPage"),
        ),
      S.listItem()
        .title("About page")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Design Your Travel page")
        .id("designYourTravelPage")
        .child(
          S.document()
            .schemaType("designYourTravelPage")
            .documentId("designYourTravelPage"),
        ),
      S.listItem()
        .title("Destinations")
        .child(
          S.documentTypeList("destinations")
            .title("Destinations")
            .defaultOrdering([{ field: "name", direction: "asc" }]),
        ),
      S.listItem()
        .title("Itineraries")
        .child(
          S.documentTypeList("itinerary")
            .title("Itineraries")
            .defaultOrdering([{ field: "title", direction: "asc" }]),
        ),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() !== "homePage" &&
          item.getId() !== "logo" &&
          item.getId() !== "servicesPage" &&
          item.getId() !== "faqPage" &&
          item.getId() !== "contactPage" &&
          item.getId() !== "aboutPage" &&
          item.getId() !== "designYourTravelPage" &&
          item.getId() !== "destinations" &&
          item.getId() !== "itinerary",
      ),
    ]);
