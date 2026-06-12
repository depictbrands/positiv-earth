import { defineArrayMember, defineField, defineType } from "sanity";

export const itineraryNextItinerariesSection = defineType({
  name: "itineraryNextItinerariesSection",
  title: "Itinerary next itineraries",
  type: "object",
  fields: [
    defineField({
      name: "headingLeading",
      title: "Heading (leading line)",
      type: "string",
      description: 'e.g. "Next"',
    }),
    defineField({
      name: "headingTrailing",
      title: "Heading (trailing line)",
      type: "string",
      description: 'e.g. "Itineraries"',
    }),
    defineField({
      name: "editorialSlugs",
      title: "Editorial picks (slugs)",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Optional itinerary slugs to prioritize in recommendations, e.g. vietnam, costa-rica.",
    }),
  ],
  preview: {
    select: { title: "headingLeading", subtitle: "headingTrailing" },
    prepare({ title, subtitle }) {
      return {
        title: [title, subtitle].filter(Boolean).join(" ") || "Next itineraries",
      };
    },
  },
});
