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
      name: "buttonHref",
      title: "Button URL",
      type: "string",
      description: "Relative path for internal links, e.g. /contact",
    }),
    defineField({
      name: "image",
      title: "Background image",
      type: "imageWithAlt",
    }),
  ],
});
