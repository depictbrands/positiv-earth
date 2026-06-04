import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "About page",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "aboutHeroSection",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About page" };
    },
  },
});
