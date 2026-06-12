import { defineArrayMember, defineField, defineType } from "sanity";

export const itineraryAccommodationCity = defineType({
  name: "itineraryAccommodationCity",
  title: "Accommodation city",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      type: "string",
      description: 'Stable tab id, e.g. "cusco"',
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'Tab label, e.g. "Cusco Hotels"',
    }),
    defineField({
      name: "hotels",
      title: "Hotels",
      type: "array",
      of: [defineArrayMember({ type: "itineraryHotel" })],
      description: "First hotel renders as the large featured card.",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "id" },
  },
});
