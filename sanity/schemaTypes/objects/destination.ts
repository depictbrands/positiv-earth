import { defineArrayMember, defineField, defineType } from "sanity";

export const destination = defineType({
  name: "destination",
  title: "Destination",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "durationDays",
      title: "Duration (days)",
      type: "number",
    }),
    defineField({
      name: "locations",
      title: "Locations",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "href",
      title: "Link URL",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "durationDays", media: "image.asset" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `${subtitle} days` : undefined,
        media,
      };
    },
  },
});
