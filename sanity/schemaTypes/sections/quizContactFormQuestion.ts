import { defineArrayMember, defineField, defineType } from "sanity";

export const quizContactFormQuestion = defineType({
  name: "quizContactFormQuestion",
  title: "Question — contact form",
  description: "The final lead-capture step. Its forward control reads \"Submit\".",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      description: "Stable identifier for this question (e.g. \"contact\").",
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
      name: "firstNameLabel",
      title: "First name label",
      type: "string",
    }),
    defineField({
      name: "lastNameLabel",
      title: "Last name label",
      type: "string",
    }),
    defineField({
      name: "phoneLabel",
      title: "Phone label",
      type: "string",
    }),
    defineField({
      name: "emailLabel",
      title: "Email label",
      type: "string",
    }),
    defineField({
      name: "countryLabel",
      title: "Country label",
      type: "string",
    }),
    defineField({
      name: "countryOptions",
      title: "Country options",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "notesLabel",
      title: "Additional notes label",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "prompt" },
    prepare({ title }) {
      return { title: title || "Contact form", subtitle: "Final step" };
    },
  },
});
