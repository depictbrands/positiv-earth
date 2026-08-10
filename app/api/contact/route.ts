import { NextResponse } from "next/server";
import { Resend } from "resend";

import { serverClient } from "@/sanity/lib/serverClient";
import type { ContactSubmissionPayload } from "@/types/contact-submission";

// The Sanity and Resend SDKs need the Node runtime (not Edge).
export const runtime = "nodejs";

// Mirrors the footer form's client-side gate: a first name, a syntactically
// valid email, and a message are the minimum needed to act on an enquiry.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValid(payload: ContactSubmissionPayload): boolean {
  return Boolean(
    payload &&
      typeof payload.firstName === "string" &&
      payload.firstName.trim() &&
      typeof payload.email === "string" &&
      EMAIL_RE.test(payload.email.trim()) &&
      typeof payload.message === "string" &&
      payload.message.trim(),
  );
}

// Build a plain-text summary of the enquiry for the notification email.
function formatEmail(payload: ContactSubmissionPayload): string {
  const { firstName, lastName, email, phone, message } = payload;
  const lines: string[] = [
    `Name: ${[firstName, lastName].filter(Boolean).join(" ")}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    "",
    `Message: ${message}`,
  ];

  return lines.filter((line) => line !== "").join("\n");
}

export async function POST(req: Request) {
  let payload: ContactSubmissionPayload;
  try {
    payload = (await req.json()) as ContactSubmissionPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValid(payload)) {
    return NextResponse.json(
      { error: "A first name, a valid email, and a message are required." },
      { status: 400 },
    );
  }

  const firstName = payload.firstName.trim();
  const lastName = payload.lastName?.trim() ?? "";
  const email = payload.email.trim();
  const phone = payload.phone?.trim() ?? "";
  const message = payload.message.trim();

  // 1. Persist the enquiry (source of truth). A missing write client or a
  //    failed write is a real failure — surface it so the client can show an
  //    error.
  if (!serverClient) {
    console.error("Contact submission failed: Sanity write client not configured.");
    return NextResponse.json(
      { error: "Submissions are not configured." },
      { status: 500 },
    );
  }

  try {
    await serverClient.create({
      _type: "contactSubmission",
      submittedAt: new Date().toISOString(),
      firstName,
      lastName: lastName || undefined,
      email,
      phone: phone || undefined,
      message,
    });
  } catch (error) {
    console.error("Contact submission failed to persist:", error);
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 500 },
    );
  }

  // 2. Notify the advisor team (best-effort). The enquiry is already saved, so
  //    an email failure must not fail the request — just log it.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUIZ_NOTIFICATION_TO;
  const from = process.env.QUIZ_NOTIFICATION_FROM;

  if (apiKey && to && from) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `New contact message — ${[firstName, lastName]
          .filter(Boolean)
          .join(" ")}`,
        text: formatEmail(payload),
      });
    } catch (error) {
      console.error("Contact submission saved but email failed:", error);
    }
  } else {
    console.warn(
      "Contact submission saved but email not sent: RESEND_API_KEY / QUIZ_NOTIFICATION_TO / QUIZ_NOTIFICATION_FROM not all set.",
    );
  }

  return NextResponse.json({ ok: true });
}
