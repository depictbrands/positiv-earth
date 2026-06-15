import { defineArrayMember, defineField, defineType } from "sanity";

// A lead captured when a traveller completes the Design-Your-Travel quiz. These
// are created programmatically by the /api/quiz route (the write client), not by
// editors, so the document is effectively read-only in the Studio — the team
// uses it to triage incoming leads alongside the rest of the content.
export const quizSubmission = defineType({
  name: "quizSubmission",
  title: "Quiz submission",
  type: "document",
  // Created via the API; editors only read these. Hide the create/delete affordances.
  readOnly: true,
  fields: [
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
    }),
    defineField({
      name: "party",
      title: "Travelling party",
      description: "Question 1 — who is travelling.",
      type: "string",
    }),
    defineField({
      name: "adults",
      title: "Adults",
      type: "number",
    }),
    defineField({
      name: "childrenAges",
      title: "Children ages",
      type: "array",
      of: [defineArrayMember({ type: "number" })],
    }),
    defineField({
      name: "interests",
      title: "Interests",
      description: "Questions 2 & 3 — selected traveller types and landscapes.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "quizInterest",
          fields: [
            defineField({ name: "prompt", title: "Question", type: "string" }),
            defineField({
              name: "choices",
              title: "Selected",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { title: "prompt", choices: "choices" },
            prepare({ title, choices }) {
              return {
                title,
                subtitle: Array.isArray(choices) ? choices.join(", ") : "",
              };
            },
          },
        }),
      ],
    }),
    defineField({ name: "firstName", title: "First name", type: "string" }),
    defineField({ name: "lastName", title: "Last name", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "country", title: "Country", type: "string" }),
    defineField({ name: "notes", title: "Additional notes", type: "text" }),
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
      submittedAt: "submittedAt",
    },
    prepare({ firstName, lastName, email, submittedAt }) {
      const name = [firstName, lastName].filter(Boolean).join(" ").trim();
      const when = submittedAt
        ? new Date(submittedAt).toLocaleDateString()
        : "";
      return {
        title: name || email || "Quiz submission",
        subtitle: [email, when].filter(Boolean).join(" · "),
      };
    },
  },
});
