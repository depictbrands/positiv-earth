import { defineField, defineType } from "sanity";

export const quizTravelerCount = defineType({
  name: "quizTravelerCount",
  title: "Traveller-count sub-scene",
  description:
    'The "Who Will Be Travelling?" follow-up shown when a "group" option is chosen.',
  type: "object",
  fields: [
    defineField({
      name: "prompt",
      title: "Prompt",
      type: "string",
    }),
    defineField({
      name: "adultsLabel",
      title: "Adults label",
      type: "string",
    }),
    defineField({
      name: "adultsPlaceholder",
      title: "Adults placeholder",
      type: "string",
    }),
    defineField({
      name: "addChildrenLabel",
      title: "Add-children label",
      type: "string",
    }),
    defineField({
      name: "childrenLabel",
      title: "Children line label",
      type: "string",
    }),
    defineField({
      name: "childAgePlaceholder",
      title: "Child age placeholder",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "prompt" },
    prepare({ title }) {
      return { title: title || "Traveller-count sub-scene" };
    },
  },
});
