import { defineField, defineType } from "sanity";

export const contactSocial = defineType({
  name: "contactSocial",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "Instagram" },
          { title: "TikTok", value: "TikTok" },
          { title: "WhatsApp", value: "WhatsApp" },
        ],
      },
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});
