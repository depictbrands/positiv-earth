import { defineField, defineType } from "sanity";

export const aboutIntroSection = defineType({
  name: "aboutIntroSection",
  title: "About intro",
  type: "object",
  fields: [
    defineField({
      name: "stats",
      title: "Credential lines",
      description: "Exactly three two-tone lines that rise into place.",
      type: "array",
      of: [{ type: "aboutIntroStat" }],
      validation: (Rule) => Rule.length(3),
    }),
    defineField({
      name: "portrait",
      title: "Portrait photo",
      description: "Centre portrait of the advisor.",
      type: "imageWithAlt",
    }),
  ],
});
