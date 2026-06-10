import { defineArrayMember, defineField, defineType } from "sanity";

export const quizPartyQuestion = defineType({
  name: "quizPartyQuestion",
  title: "Question — travelling party (icon options)",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      description: "Stable identifier for this question (e.g. \"who-is-traveling\").",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "prompt",
      title: "Prompt",
      description: 'Heading shown above the options, e.g. "Who Will Be Traveling".',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      of: [defineArrayMember({ type: "quizOption" })],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "travelerCount",
      title: "Traveller-count sub-scene",
      description: 'Shown when a "group" option is chosen. Shares this step.',
      type: "quizTravelerCount",
    }),
  ],
  preview: {
    select: { title: "prompt" },
    prepare({ title }) {
      return { title: title || "Party question", subtitle: "Icon options" };
    },
  },
});
