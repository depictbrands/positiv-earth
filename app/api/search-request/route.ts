import { NextResponse } from "next/server";

import { serverClient } from "@/sanity/lib/serverClient";
import type { SearchRequestPayload } from "@/types/search-request";

// The Sanity SDK needs the Node runtime (not Edge).
export const runtime = "nodejs";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Accept only well-formed local dates; anything else is dropped rather than
// persisted, so an odd client value can't corrupt the lead.
function sanitizeDate(value: unknown): string | undefined {
  return typeof value === "string" && ISO_DATE_RE.test(value)
    ? value
    : undefined;
}

export async function POST(req: Request) {
  let payload: SearchRequestPayload;
  try {
    payload = (await req.json()) as SearchRequestPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const where = typeof payload.where === "string" ? payload.where.trim() : "";
  const what = typeof payload.what === "string" ? payload.what.trim() : "";
  const dateFrom = sanitizeDate(payload.dateFrom);
  const dateTo = sanitizeDate(payload.dateTo);

  // Nothing meaningful to capture — don't create an empty lead.
  if (!where && !what && !dateFrom && !dateTo) {
    return NextResponse.json({ error: "Empty search." }, { status: 400 });
  }

  // Persist the enquiry (source of truth). A missing write client or a failed
  // write is a real failure — surface it so the client can log it.
  if (!serverClient) {
    console.error(
      "Search request failed: Sanity write client not configured.",
    );
    return NextResponse.json(
      { error: "Submissions are not configured." },
      { status: 500 },
    );
  }

  try {
    await serverClient.create({
      _type: "searchRequest",
      submittedAt: new Date().toISOString(),
      where: where || undefined,
      what: what || undefined,
      dateFrom,
      dateTo,
    });
  } catch (error) {
    console.error("Search request failed to persist:", error);
    return NextResponse.json(
      { error: "Could not save your search. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
