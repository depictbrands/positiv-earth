import { defineArrayMember, defineField, defineType } from "sanity";

export const testimonialSection = defineType({
  name: "testimonialSection",
  title: "Testimonials",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [defineArrayMember({ type: "testimonial" })],
    }),
  ],
});
