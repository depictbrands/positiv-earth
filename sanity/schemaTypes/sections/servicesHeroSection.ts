import { defineField, defineType } from "sanity";

export const servicesHeroSection = defineType({
  name: "servicesHeroSection",
  title: "Services hero",
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
