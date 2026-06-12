import { defineArrayMember, defineField, defineType } from "sanity";

export const itineraryLocalFoodSection = defineType({
  name: "itineraryLocalFoodSection",
  title: "Itinerary local food",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "galleryImages",
      title: "Gallery images",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "tagline", media: "heroImage.asset" },
  },
});
