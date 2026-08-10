/**
 * The JSON payload the footer contact form POSTs to `/api/contact`.
 *
 * A visitor can send the advisor team a message from any page's footer. The
 * enquiry is persisted as a `contactSubmission` document (source of truth the
 * team triages in Sanity Studio) and also emailed to the team (best-effort).
 */
export type ContactSubmissionPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};
