import { defineField, defineType } from "sanity";

export const aboutSceneSection = defineType({
  name: "aboutSceneSection",
  title: "About scene",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      description:
        'Supporting paragraph. For the "Why Us" scene, put each benefit on its own line.',
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "images",
      title: "Decorative images",
      description:
        "Up to two images. The first is placed on the left, the second on the right; both parallax on scroll.",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      validation: (Rule) => Rule.max(2),
    }),
  ],
});
