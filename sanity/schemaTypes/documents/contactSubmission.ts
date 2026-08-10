import { defineField, defineType } from "sanity";

// A lead captured when a visitor sends a message from the footer contact form.
// Created programmatically by the /api/contact route (the write client), not by
// editors, so the document is read-only in the Studio — the team uses it to
// triage incoming enquiries alongside the quiz and search submissions.
export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact submission",
  type: "document",
  // Created via the API; editors only read these. Hide create/delete affordances.
  readOnly: true,
  fields: [
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
    }),
    defineField({ name: "firstName", title: "First name", type: "string" }),
    defineField({ name: "lastName", title: "Last name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
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
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      message: "message",
      submittedAt: "submittedAt",
    },
    prepare({ firstName, lastName, email, message, submittedAt }) {
      const name = [firstName, lastName].filter(Boolean).join(" ").trim();
      const when = submittedAt
        ? new Date(submittedAt).toLocaleDateString()
        : "";
      return {
        title: name || email || "Contact submission",
        subtitle: [message, when].filter(Boolean).join(" · "),
      };
    },
  },
});
