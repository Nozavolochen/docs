// The front page renders its mods table from src/data/framework-mods.json,
// refreshed weekly by scripts/fetch-framework-mods.mjs. The JSON is the
// contract between the two, so its shape is pinned here.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  GAME_DOMAIN,
  FRAMEWORK_MOD_ID,
  modUrl,
  toRecords,
} from "../../scripts/fetch-framework-mods.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const payload = JSON.parse(
  readFileSync(join(root, "src", "data", "framework-mods.json"), "utf8"),
);

describe("framework-mods.json", () => {
  it("names the framework mod and game", () => {
    expect(payload.frameworkModId).toBe(FRAMEWORK_MOD_ID);
    expect(payload.gameDomain).toBe(GAME_DOMAIN);
    expect(new Date(payload.generatedAt).toISOString()).toBe(
      payload.generatedAt,
    );
  });

  it("lists at least one mod with complete records", () => {
    expect(Array.isArray(payload.mods)).toBe(true);
    expect(payload.mods.length).toBeGreaterThan(0);
    for (const mod of payload.mods) {
      expect(mod.modId).toEqual(expect.any(Number));
      for (const field of ["name", "summary", "version", "updatedAt"]) {
        expect(typeof mod[field], field).toBe("string");
        expect(mod[field].length).toBeGreaterThan(0);
      }
      for (const field of ["downloads", "endorsements"]) {
        expect(Number.isInteger(mod[field]), field).toBe(true);
        expect(mod[field]).toBeGreaterThanOrEqual(0);
      }
      expect(mod.url).toBe(modUrl(GAME_DOMAIN, mod.modId));
    }
  });

  it("is sorted by downloads, most first", () => {
    const downloads = payload.mods.map(
      (m: { downloads: number }) => m.downloads,
    );
    expect([...downloads].sort((a, b) => b - a)).toEqual(downloads);
  });
});

describe("toRecords", () => {
  const dependents = [{ modId: 1 }, { modId: 2 }, { modId: 3 }];
  const details = [
    {
      modId: 1,
      name: "Quiet",
      summary: "s",
      version: "1.0",
      downloads: 5,
      endorsements: 0,
      updatedAt: "2026-01-01T00:00:00Z",
      status: "published",
    },
    {
      modId: 2,
      name: "Popular",
      summary: "s",
      version: "2.0",
      downloads: 50,
      endorsements: 3,
      updatedAt: "2026-02-01T00:00:00Z",
      status: "published",
    },
    {
      modId: 3,
      name: "Hidden",
      summary: "s",
      version: "1.0",
      downloads: 500,
      endorsements: 30,
      updatedAt: "2026-03-01T00:00:00Z",
      status: "hidden",
    },
  ];

  it("drops unpublished mods and sorts the rest by downloads", () => {
    const records = toRecords(dependents, details);
    expect(records.map((r: { modId: number }) => r.modId)).toEqual([2, 1]);
    expect(records[0].url).toBe("https://www.nexusmods.com/nomanssky/mods/2");
  });

  it("drops dependents with no details row", () => {
    expect(toRecords([{ modId: 9 }], details)).toEqual([]);
  });
});
