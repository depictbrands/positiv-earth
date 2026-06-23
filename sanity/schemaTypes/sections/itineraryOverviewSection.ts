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
      name: "accordionItems",
      title: "Accordion items",
      type: "array",
      of: [defineArrayMember({ type: "itineraryOverviewAccordionItem" })],
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
