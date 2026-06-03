import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description:
        "The first word renders white over the photo; the rest renders black below it.",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "image.asset" },
  },
});
