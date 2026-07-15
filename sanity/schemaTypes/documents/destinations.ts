import { defineArrayMember, defineField, defineType } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export const destinations = defineType({
  name: "destinations",
  title: "Destination",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "destinations" }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "durationDays",
      title: "Duration (days)",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "locations",
      title: "Locations",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link URL",
      type: "string",
      description: "Path to the itinerary page, e.g. /itinerary/vietnam",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "durationDays", media: "image.asset" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `${subtitle} days` : undefined,
        media,
      };
    },
  },
});
