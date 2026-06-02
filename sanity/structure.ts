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
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "homePage",
      ),
    ]);
