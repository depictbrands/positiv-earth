import { defineField, defineType } from "sanity";

export const itineraryProcessStep = defineType({
  name: "itineraryProcessStep",
  title: "Process step",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
