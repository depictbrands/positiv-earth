import { defineArrayMember, defineField, defineType } from "sanity";

export const itineraryAccommodationSection = defineType({
  name: "itineraryAccommodationSection",
  title: "Itinerary accommodation",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "cities",
      title: "Cities",
      type: "array",
      of: [defineArrayMember({ type: "itineraryAccommodationCity" })],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
