/**
 * One-time migration: hero background images moved from the shared
 * `imageWithAlt` object to the new `heroImage` object, which adds the optional
 * tablet / mobile crops.
 *
 * The stored value keeps its fields (`asset`, `alt`) but still carries
 * `_type: "imageWithAlt"`, which no longer matches the field's schema type —
 * Studio flags that as an invalid value. This rewrites the `_type` only; no
 * image, alt text, hotspot, or crop is touched.
 *
 * Safe to re-run: documents already on `heroImage` are skipped.
 *
 * Usage: npm run sanity:migrate-hero-image-type
 * Requires SANITY_API_WRITE_TOKEN in .env.local
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@sanity/client";

const OLD_TYPE = "imageWithAlt";
const NEW_TYPE = "heroImage";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvLocal();

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-06-02";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local",
    );
  }

  if (!token) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN in .env.local (needs write access)",
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  // Drafts included: an unpublished edit carries the stale _type too.
  const documents = await client.fetch(
    `*[hero.backgroundImage._type == $oldType]{ _id, _type }`,
    { oldType: OLD_TYPE },
  );

  if (documents.length === 0) {
    console.log("No hero background images left on the old type.");
    return;
  }

  let transaction = client.transaction();

  for (const document of documents) {
    transaction = transaction.patch(document._id, {
      set: { "hero.backgroundImage._type": NEW_TYPE },
    });
  }

  await transaction.commit({
    visibility: "async",
    tag: "migrate-hero-image-type",
  });

  console.log(
    `Moved ${documents.length} hero background image(s) to "${NEW_TYPE}".`,
  );
  for (const document of documents) {
    console.log(`  - ${document._type} (${document._id})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
