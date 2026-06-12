import { defineField, defineType } from "sanity";

export const itineraryHotel = defineType({
  name: "itineraryHotel",
  title: "Hotel",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
    }),
  ],
  preview: {
    select: { title: "name", media: "image.asset" },
  },
});
