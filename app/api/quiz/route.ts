import { NextResponse } from "next/server";
import { Resend } from "resend";

import { serverClient } from "@/sanity/lib/serverClient";
import type { QuizSubmissionPayload } from "@/types/quiz-submission";

// The Sanity and Resend SDKs need the Node runtime (not Edge).
export const runtime = "nodejs";

// Mirrors the client-side gate in DesignYourTravelQuiz: a first name and a
// syntactically valid email are the minimum needed to act on a lead.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValid(payload: QuizSubmissionPayload): boolean {
  const contact = payload.contact;
  return Boolean(
    contact &&
      typeof contact.firstName === "string" &&
      contact.firstName.trim() &&
      typeof contact.email === "string" &&
      EMAIL_RE.test(contact.email.trim()),
  );
}

// Build a plain-text summary of the lead for the notification email.
function formatEmail(payload: QuizSubmissionPayload): string {
  const { party, travelers, interests, contact } = payload;
  const lines: string[] = [
    `Name: ${[contact.firstName, contact.lastName].filter(Boolean).join(" ")}`,
    `Email: ${contact.email}`,
    contact.phone ? `Phone: ${contact.phone}` : "",
    contact.country ? `Country: ${contact.country}` : "",
    "",
    party ? `Travelling party: ${party.label}` : "",
    travelers
      ? `Travellers: ${travelers.adults} adult(s)${
          travelers.childrenAges.length
            ? `, children aged ${travelers.childrenAges.join(", ")}`
            : ""
        }`
      : "",
  ];

  for (const interest of interests) {
    lines.push(
      `${interest.prompt}: ${interest.choices.map((c) => c.label).join(", ")}`,
    );
  }

  if (contact.notes) {
    lines.push("", `Notes: ${contact.notes}`);
  }

  return lines.filter((line) => line !== "").join("\n");
}

export async function POST(req: Request) {
  let payload: QuizSubmissionPayload;
  try {
    payload = (await req.json()) as QuizSubmissionPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValid(payload)) {
    return NextResponse.json(
      { error: "A first name and a valid email are required." },
      { status: 400 },
    );
  }

  // 1. Persist the lead (source of truth). A missing write client or a failed
  //    write is a real failure — surface it so the client can show an error.
  if (!serverClient) {
    console.error("Quiz submission failed: Sanity write client not configured.");
    return NextResponse.json(
      { error: "Submissions are not configured." },
      { status: 500 },
    );
  }

  const { party, travelers, interests, contact } = payload;
  try {
    await serverClient.create({
      _type: "quizSubmission",
      submittedAt: new Date().toISOString(),
      party: party?.label ?? "",
      adults: travelers?.adults,
      childrenAges: travelers?.childrenAges ?? [],
      interests: interests.map((interest) => ({
        _type: "quizInterest",
        prompt: interest.prompt,
        choices: interest.choices.map((c) => c.label),
      })),
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
      email: contact.email,
      country: contact.country,
      notes: contact.notes,
    });
  } catch (error) {
    console.error("Quiz submission failed to persist:", error);
    return NextResponse.json(
      { error: "Could not save your submission. Please try again." },
      { status: 500 },
    );
  }

  // 2. Notify the advisor team (best-effort). The lead is already saved, so an
  //    email failure must not fail the request — just log it.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUIZ_NOTIFICATION_TO;
  const from = process.env.QUIZ_NOTIFICATION_FROM;

  if (apiKey && to && from) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        replyTo: contact.email,
        subject: `New quiz lead — ${[contact.firstName, contact.lastName]
          .filter(Boolean)
          .join(" ")}`,
        text: formatEmail(payload),
      });
    } catch (error) {
      console.error("Quiz submission saved but email failed:", error);
    }
  } else {
    console.warn(
      "Quiz submission saved but email not sent: RESEND_API_KEY / QUIZ_NOTIFICATION_TO / QUIZ_NOTIFICATION_FROM not all set.",
    );
  }

  return NextResponse.json({ ok: true });
}
