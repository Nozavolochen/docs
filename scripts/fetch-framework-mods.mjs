// Regenerates src/data/framework-mods.json: every Nexus Mods upload that
// declares the Nozavolochen framework as a requirement.
//
// Usage: NEXUS_MODS_API_KEY=<personal key> node scripts/fetch-framework-mods.mjs
//
// Test override: NEXUS_GRAPHQL_URL=http://localhost:PORT/graphql serves a
// stub for the two queries below (used to exercise the script end to end
// without touching the live API).

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "src", "data", "framework-mods.json");

export const GAME_DOMAIN = "nomanssky";
export const GAME_ID = 1634;
export const FRAMEWORK_MOD_ID = 4700;
const PAGE_SIZE = 100;

const DEPENDENTS_QUERY = `query FrameworkDependents($gameId: ID!, $modId: ID!, $offset: Int, $count: Int) {
  mod(gameId: $gameId, modId: $modId) {
    modRequirements {
      modsRequiringThisMod(offset: $offset, count: $count) {
        totalCount
        nodes { modId }
      }
    }
  }
}`;

const DETAILS_QUERY = `query ModDetails($ids: [CompositeDomainWithIdInput!]!) {
  legacyModsByDomain(ids: $ids) {
    nodes { modId name summary version downloads endorsements updatedAt status }
  }
}`;

export function modUrl(gameDomain, modId) {
  return `https://www.nexusmods.com/${gameDomain}/mods/${modId}`;
}

// Merge the sparse dependent rows with their full details, keeping only
// published mods, most downloaded first so the table order is stable.
export function toRecords(dependents, details) {
  const byId = new Map(details.map((d) => [Number(d.modId), d]));
  return dependents
    .map((d) => byId.get(Number(d.modId)))
    .filter((d) => d && d.status === "published")
    .map((d) => ({
      modId: Number(d.modId),
      name: d.name,
      summary: d.summary,
      version: d.version,
      downloads: d.downloads,
      endorsements: d.endorsements,
      updatedAt: d.updatedAt,
      url: modUrl(GAME_DOMAIN, d.modId),
    }))
    .sort((a, b) => b.downloads - a.downloads);
}

async function graphql(query, variables) {
  const key = process.env.NEXUS_MODS_API_KEY?.trim();
  if (!key) throw new Error("NEXUS_MODS_API_KEY is not set");
  const endpoint =
    process.env.NEXUS_GRAPHQL_URL?.trim() ||
    "https://api.nexusmods.com/v2/graphql";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      APIKEY: key,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Nexus API answered ${res.status}`);
  const body = await res.json();
  if (body.errors?.length)
    throw new Error(`Nexus API error: ${JSON.stringify(body.errors)}`);
  return body.data;
}

async function fetchDependents() {
  const ids = [];
  let offset = 0;
  for (;;) {
    const data = await graphql(DEPENDENTS_QUERY, {
      gameId: GAME_ID,
      modId: FRAMEWORK_MOD_ID,
      offset,
      count: PAGE_SIZE,
    });
    const page = data.mod.modRequirements.modsRequiringThisMod;
    ids.push(...page.nodes.map((n) => Number(n.modId)));
    if (ids.length >= page.totalCount) break;
    offset += PAGE_SIZE;
  }
  return ids;
}

async function fetchDetails(modIds) {
  const out = [];
  for (let i = 0; i < modIds.length; i += 50) {
    const data = await graphql(DETAILS_QUERY, {
      ids: modIds
        .slice(i, i + 50)
        .map((modId) => ({ gameDomain: GAME_DOMAIN, modId })),
    });
    out.push(...data.legacyModsByDomain.nodes);
  }
  return out;
}

async function main() {
  const dependents = await fetchDependents();
  const details = dependents.length ? await fetchDetails(dependents) : [];
  const payload = {
    frameworkModId: FRAMEWORK_MOD_ID,
    gameDomain: GAME_DOMAIN,
    generatedAt: new Date().toISOString(),
    mods: toRecords(
      dependents.map((modId) => ({ modId })),
      details,
    ),
  };
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `framework-mods: wrote ${payload.mods.length} mod(s) to src/data/framework-mods.json`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
