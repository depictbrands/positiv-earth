import { defineField, defineType } from "sanity";

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "FAQ page",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "faqHeroSection",
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "faqSection",
    }),
  ],
  preview: {
    prepare() {
      return { title: "FAQ page" };
    },
  },
});
