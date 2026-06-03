import { defineArrayMember, defineField, defineType } from "sanity";

export const contactInfoSection = defineType({
  name: "contactInfoSection",
  title: "Contact info",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Advisor name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      of: [defineArrayMember({ type: "contactSocial" })],
    }),
    defineField({
      name: "photos",
      title: "Photos",
      description: "The first two are shown as the overlapping pair.",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
  ],
});
