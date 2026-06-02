import { defineField, defineType } from "sanity";

export const ctaLink = defineType({
  name: "ctaLink",
  title: "CTA link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "string",
    }),
  ],
});
