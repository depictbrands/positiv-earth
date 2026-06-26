import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name / Label",
      description:
        "Internal label, also used as the video's accessible description.",
      type: "string",
    }),
    defineField({
      name: "video",
      title: "Video",
      description: "Upload an MP4 (9:16 portrait). Plays on hover.",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      description:
        "Optional still shown before the video plays (e.g. the first frame).",
      type: "imageWithAlt",
    }),
  ],
  preview: {
    select: { title: "name", media: "poster.asset" },
    prepare({ title, media }) {
      return { title: title || "Testimonial", media };
    },
  },
});
