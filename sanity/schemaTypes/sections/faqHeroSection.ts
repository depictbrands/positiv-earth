import { defineField, defineType } from "sanity";

export const faqHeroSection = defineType({
  name: "faqHeroSection",
  title: "FAQ hero",
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
      type: "heroImage",
    }),
  ],
});
