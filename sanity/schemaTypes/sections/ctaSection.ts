import { defineField, defineType } from "sanity";

export const ctaSection = defineType({
  name: "ctaSection",
  title: "CTA",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "buttonLabel",
      title: "Button label",
      type: "string",
    }),
    defineField({
      name: "buttonHref",
      title: "Button URL",
      type: "string",
      description:
        "Internal path (e.g. /contact) or full external URL (e.g. https://example.com).",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || typeof value !== "string") {
            return true;
          }

          const trimmed = value.trim();

          if (trimmed.startsWith("/")) {
            return true;
          }

          try {
            new URL(trimmed);
            return true;
          } catch {
            return "Enter a relative path (e.g. /contact) or a full URL (e.g. https://example.com).";
          }
        }),
    }),
    defineField({
      name: "image",
      title: "Background image",
      type: "imageWithAlt",
    }),
  ],
});
