import { defineField, defineType } from "sanity";

export const contactHeroSection = defineType({
  name: "contactHeroSection",
  title: "Contact hero",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "imageWithAlt",
    }),
  ],
});
