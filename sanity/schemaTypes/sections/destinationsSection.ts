import { defineArrayMember, defineField, defineType } from "sanity";

export const destinationsSection = defineType({
  name: "destinationsSection",
  title: "Destinations",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "destinations",
      title: "Destinations",
      type: "array",
      of: [defineArrayMember({ type: "destination" })],
    }),
  ],
});
