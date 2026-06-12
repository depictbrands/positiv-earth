import { defineField, defineType } from "sanity";

export const itineraryDayPeriod = defineType({
  name: "itineraryDayPeriod",
  title: "Day period",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Period name",
      type: "string",
      description: 'e.g. "Morning"',
    }),
    defineField({
      name: "meal",
      title: "Meal",
      type: "string",
      description: 'e.g. "Breakfast" or "Don\'t include lunch"',
    }),
    defineField({
      name: "mealPlace",
      title: "Meal place",
      type: "string",
    }),
    defineField({
      name: "mealIncluded",
      title: "Meal included",
      type: "boolean",
    }),
    defineField({
      name: "activity",
      title: "Activity",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "meal" },
  },
});
