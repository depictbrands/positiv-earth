import { defineArrayMember, defineField, defineType } from "sanity";

export const brandStorySection = defineType({
  name: "brandStorySection",
  title: "Brand story",
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
      description: "Word in the heading rendered in italic.",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "ctaLink",
    }),
  ],
});
