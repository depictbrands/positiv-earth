import { defineArrayMember, defineField, defineType } from "sanity";

export const itineraryWhatsIncludedSection = defineType({
  name: "itineraryWhatsIncludedSection",
  title: "Itinerary what's included",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "includesHeading",
      title: "Includes heading",
      type: "string",
    }),
    defineField({
      name: "notIncludesHeading",
      title: "Not includes heading",
      type: "string",
    }),
    defineField({
      name: "includes",
      title: "Includes",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "notIncludes",
      title: "Not includes",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
