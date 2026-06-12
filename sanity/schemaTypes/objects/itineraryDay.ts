import { defineField, defineType } from "sanity";

export const itineraryDay = defineType({
  name: "itineraryDay",
  title: "Itinerary day",
  type: "object",
  fields: [
    defineField({
      name: "dayLabel",
      title: "Day label",
      type: "string",
      description: 'e.g. "DAY 1"',
    }),
    defineField({
      name: "daySummary",
      title: "Day summary",
      type: "text",
      rows: 2,
      description: "Rail summary; line breaks are preserved.",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "string",
      description: 'e.g. "OCT 22, 2026"',
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "detail",
      title: "Detail modal",
      type: "itineraryDayDetail",
    }),
  ],
  preview: {
    select: { title: "dayLabel", subtitle: "headline", media: "image.asset" },
  },
});
