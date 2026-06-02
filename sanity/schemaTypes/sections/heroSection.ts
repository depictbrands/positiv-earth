import { defineField, defineType } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "headlinePre",
      title: "Headline (before emphasis)",
      type: "string",
    }),
    defineField({
      name: "headlineEmphasis",
      title: "Headline emphasis",
      type: "string",
    }),
    defineField({
      name: "headlinePost",
      title: "Headline (after emphasis)",
      type: "string",
    }),
    defineField({
      name: "subcopy",
      title: "Subcopy",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "imageWithAlt",
    }),
  ],
});
