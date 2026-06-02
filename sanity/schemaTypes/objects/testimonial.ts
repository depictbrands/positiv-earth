import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "imageWithAlt",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "quote", media: "avatar.asset" },
  },
});
