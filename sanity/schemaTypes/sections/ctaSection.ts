import { defineField, defineType } from "sanity";

export const ctaSection = defineType({
  name: "ctaSection",
  title: "CTA",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "buttonLabel",
      title: "Button label",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Background image",
      type: "imageWithAlt",
    }),
  ],
});
