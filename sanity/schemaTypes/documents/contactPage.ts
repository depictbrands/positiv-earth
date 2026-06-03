import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Contact page",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "contactHeroSection",
    }),
    defineField({
      name: "info",
      title: "Contact info",
      type: "contactInfoSection",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact page" };
    },
  },
});
