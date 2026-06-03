import { defineArrayMember, defineField, defineType } from "sanity";

export const threeServicesSection = defineType({
  name: "threeServicesSection",
  title: "Three services",
  type: "object",
  fields: [
    defineField({
      name: "services",
      title: "Services",
      description: "The page is designed for three services.",
      type: "array",
      of: [defineArrayMember({ type: "service" })],
    }),
  ],
});
