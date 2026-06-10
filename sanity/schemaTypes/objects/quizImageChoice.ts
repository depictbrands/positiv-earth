import { defineField, defineType } from "sanity";

export const quizImageChoice = defineType({
  name: "quizImageChoice",
  title: "Picture-card choice",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      description:
        "Stable identifier used for selection state. Lowercase, no spaces (e.g. \"coastlines\").",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
    }),
  ],
  preview: {
    select: { title: "label", media: "image.asset" },
  },
});
