import { defineField, defineType } from "sanity";

// A lead captured when a traveller runs the home-page search bar. There is no
// destination database yet, so a search routes the traveller to the featured
// destinations section while this records what they were after. Created
// programmatically by the /api/search-request route (the write client), not by
// editors, so the document is read-only in the Studio — the team uses it to
// triage incoming enquiries alongside the quiz submissions.
export const searchRequest = defineType({
  name: "searchRequest",
  title: "Search request",
  type: "document",
  // Created via the API; editors only read these. Hide create/delete affordances.
  readOnly: true,
  fields: [
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
    }),
    defineField({
      name: "where",
      title: "Where",
      description: "Destination the traveller searched for.",
      type: "string",
    }),
    defineField({
      name: "what",
      title: "What",
      description: "What the traveller wants to see or do.",
      type: "string",
    }),
    defineField({
      name: "dateFrom",
      title: "Travelling from",
      type: "date",
    }),
    defineField({
      name: "dateTo",
      title: "Travelling to",
      type: "date",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      where: "where",
      what: "what",
      dateFrom: "dateFrom",
      dateTo: "dateTo",
      submittedAt: "submittedAt",
    },
    prepare({ where, what, dateFrom, dateTo, submittedAt }) {
      const dates = [dateFrom, dateTo].filter(Boolean).join(" – ");
      const when = submittedAt
        ? new Date(submittedAt).toLocaleDateString()
        : "";
      return {
        title: [where, what].filter(Boolean).join(" · ") || "Search request",
        subtitle: [dates, when].filter(Boolean).join(" · "),
      };
    },
  },
});
