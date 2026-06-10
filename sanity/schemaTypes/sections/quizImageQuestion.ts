import { defineArrayMember, defineField, defineType } from "sanity";

export const quizImageQuestion = defineType({
  name: "quizImageQuestion",
  title: "Question — picture-card choice",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      description: "Stable identifier for this question (e.g. \"landscapes\").",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "prompt",
      title: "Prompt",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "columns",
      title: "Desktop columns",
      description:
        "How many cards sit on a desktop row before wrapping (reflows to fewer on small screens).",
      type: "number",
      validation: (Rule) => Rule.min(1).integer(),
    }),
    defineField({
      name: "choices",
      title: "Choices",
      type: "array",
      of: [defineArrayMember({ type: "quizImageChoice" })],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "prompt" },
    prepare({ title }) {
      return { title: title || "Picture-card question", subtitle: "Image choices" };
    },
  },
});
