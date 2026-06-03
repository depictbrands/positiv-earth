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
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() !== "homePage" &&
          item.getId() !== "servicesPage" &&
          item.getId() !== "faqPage" &&
          item.getId() !== "contactPage",
      ),
    ]);
