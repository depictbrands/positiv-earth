/**
 * One-time (or repeatable) migration: assign orderRank to destination documents
 * that were created before drag-to-reorder was enabled.
 *
 * Usage: npm run sanity:reset-destination-order
 * Requires SANITY_API_WRITE_TOKEN in .env.local
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@sanity/client";
import { LexoRank } from "lexorank";

const ORDER_FIELD_NAME = "orderRank";

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

  const documents = await client.fetch(
    `*[_type == "destinations" && !(_id in path("drafts.**"))] | order(name asc) {
      _id,
      name,
      orderRank
    }`,
  );

  if (documents.length === 0) {
    console.log("No destination documents found.");
    return;
  }

  const missingOrder = documents.filter((doc) => !doc.orderRank?.trim());
  const targets = missingOrder.length > 0 ? missingOrder : documents;

  let rank = LexoRank.min();
  let transaction = client.transaction();

  for (const document of targets) {
    rank = rank.genNext().genNext();
    transaction = transaction.patch(document._id, {
      set: { [ORDER_FIELD_NAME]: rank.toString() },
    });
  }

  const result = await transaction.commit({
    visibility: "async",
    tag: "reset-destination-order",
  });

  console.log(
    `Updated orderRank on ${result.results?.length ?? 0} destination(s).`,
  );
  for (const document of targets) {
    console.log(`  - ${document.name ?? document._id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
