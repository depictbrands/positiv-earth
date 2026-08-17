import { defineField, defineType } from "sanity";

export const aboutHeroSection = defineType({
  name: "aboutHeroSection",
  title: "About hero",
  type: "object",
  fields: [
    defineField({
      name: "lead",
      title: "Lead word",
      description: 'Small word before the name, e.g. "Meet".',
      type: "string",
    }),
    defineField({
      name: "name",
      title: "Name",
      description: "Large emphasized name (displayed in uppercase).",
      type: "string",
    }),
    defineField({
      name: "role",
      title: "Role",
      description: 'Trailing line, e.g. "Your Travel Expert & Cultural Connector".',
      type: "string",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "heroImage",
    }),
  ],
});
