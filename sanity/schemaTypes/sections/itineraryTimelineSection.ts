import { defineArrayMember, defineField, defineType } from "sanity";

export const itineraryTimelineSection = defineType({
  name: "itineraryTimelineSection",
  title: "Itinerary timeline",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "days",
      title: "Days",
      type: "array",
      of: [defineArrayMember({ type: "itineraryDay" })],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
