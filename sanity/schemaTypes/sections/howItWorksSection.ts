import { defineArrayMember, defineField, defineType } from "sanity";

export const howItWorksSection = defineType({
  name: "howItWorksSection",
  title: "How it works",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "emphasizedWord",
      title: "Emphasized word",
      type: "string",
    }),
    defineField({
      name: "steps",
      title: "Turntable steps",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Background image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "ctaLink",
    }),
  ],
});
