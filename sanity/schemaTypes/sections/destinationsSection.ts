import { defineArrayMember, defineField, defineType } from "sanity";

export const destinationsSection = defineType({
  name: "destinationsSection",
  title: "Destinations",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "allTripsHeading",
      title: "All trips page heading",
      description:
        "Heading for the /destinations page, which lists every destination in the library.",
      type: "string",
    }),
    defineField({
      name: "featuredDestinations",
      title: "Featured destinations",
      description:
        "Select up to six destination cards from Content → Destinations to show on the home page.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "destinations" }],
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
  ],
});
