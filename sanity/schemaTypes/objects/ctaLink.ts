import { defineField, defineType } from "sanity";

export const ctaLink = defineType({
  name: "ctaLink",
  title: "CTA link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "href",
      title: "URL",
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
  ],
});
