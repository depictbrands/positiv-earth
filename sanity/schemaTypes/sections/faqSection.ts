import { defineArrayMember, defineField, defineType } from "sanity";

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
    }),
  ],
});
