import { defineField, defineType } from "sanity";

export const quizOption = defineType({
  name: "quizOption",
  title: "Quiz option",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      description:
        "Stable identifier used for selection state and branching. Lowercase, no spaces (e.g. \"with-family\").",
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
      name: "icon",
      title: "Icon",
      description: "Which drawn line icon renders above the label.",
      type: "string",
      options: {
        list: [
          { title: "Just me (single figure)", value: "just-me" },
          { title: "Friends (two figures)", value: "friends" },
          { title: "Partner (two + heart)", value: "partner" },
          { title: "Family (two + child)", value: "family" },
          { title: "Corporation (group of three)", value: "corporation" },
          { title: "Other (figure + ellipsis)", value: "other" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "branch",
      title: "Branch",
      description:
        '"Solo" stays on the options scene; "Group" opens the traveller-count sub-scene (same step).',
      type: "string",
      options: {
        list: [
          { title: "Solo", value: "solo" },
          { title: "Group", value: "group" },
        ],
        layout: "radio",
      },
      initialValue: "group",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "branch" },
  },
});
