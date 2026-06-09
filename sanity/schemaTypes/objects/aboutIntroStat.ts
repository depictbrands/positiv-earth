import { defineField, defineType } from "sanity";

export const aboutIntroStat = defineType({
  name: "aboutIntroStat",
  title: "Credential line",
  type: "object",
  fields: [
    defineField({
      name: "emphasis",
      title: "Emphasis",
      description: 'Shown in burnt-orange italic serif, e.g. "12 years".',
      type: "string",
    }),
    defineField({
      name: "rest",
      title: "Rest",
      description: 'Remaining text in black, e.g. "in airline industry".',
      type: "string",
    }),
  ],
  preview: {
    select: { emphasis: "emphasis", rest: "rest" },
    prepare({ emphasis, rest }) {
      return { title: [emphasis, rest].filter(Boolean).join(" ") || "Credential line" };
    },
  },
});
