import { defineArrayMember, defineField, defineType } from "sanity";

export const designYourTravelPage = defineType({
  name: "designYourTravelPage",
  title: "Design Your Travel page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Intro title",
      description: 'Line above the quiz panel, e.g. "Let\'s Plan Your Perfect Journey."',
      type: "string",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "totalSteps",
      title: "Total steps",
      description:
        'Drives the "Question X / N" label and the progress bar. Leave blank to use the number of questions.',
      type: "number",
      validation: (Rule) => Rule.min(1).integer(),
    }),
    defineField({
      name: "questions",
      title: "Questions",
      description: "Each question is one step in the quiz, shown in order.",
      type: "array",
      of: [
        defineArrayMember({ type: "quizPartyQuestion" }),
        defineArrayMember({ type: "quizImageQuestion" }),
        defineArrayMember({ type: "quizContactFormQuestion" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Design Your Travel page" };
    },
  },
});
