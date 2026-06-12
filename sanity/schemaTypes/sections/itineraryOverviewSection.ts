import { defineArrayMember, defineField, defineType } from "sanity";

export const itineraryOverviewSection = defineType({
  name: "itineraryOverviewSection",
  title: "Itinerary overview",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "mapImage",
      title: "Map image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "process",
      title: "Process steps",
      type: "array",
      of: [defineArrayMember({ type: "itineraryProcessStep" })],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
