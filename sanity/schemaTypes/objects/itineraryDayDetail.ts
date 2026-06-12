import { defineArrayMember, defineField, defineType } from "sanity";

export const itineraryDayDetail = defineType({
  name: "itineraryDayDetail",
  title: "Day detail",
  type: "object",
  fields: [
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "periods",
      title: "Periods",
      type: "array",
      of: [defineArrayMember({ type: "itineraryDayPeriod" })],
    }),
  ],
  preview: {
    select: { title: "city" },
  },
});
