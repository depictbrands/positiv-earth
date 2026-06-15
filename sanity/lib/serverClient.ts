import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

// Server-only Sanity client with write access. Unlike the read client
// (sanity/lib/client.ts), this one carries a write token and bypasses the CDN,
// so it can create documents (e.g. quiz lead submissions). The token is a
// server-side secret (SANITY_API_WRITE_TOKEN) and must NEVER be imported into a
// client component — keep this file behind API routes / server code only.
//
// Null when config or the token is missing, mirroring the read client's guard,
// so callers degrade gracefully instead of throwing at import time.
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

export const serverClient: SanityClient | null =
  isSanityConfigured && writeToken
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token: writeToken,
        perspective: "published",
      })
    : null;
