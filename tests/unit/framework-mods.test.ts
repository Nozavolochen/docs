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
  extractSource,
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
      if (mod.sourceUrl !== null) {
        expect(mod.sourceUrl).toMatch(
          /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/,
        );
      }
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
      description:
        "Built with [url=https://github.com/someone/buildtool]a tool[/url]" +
        "<br />Source: [url=https://github.com/me/quiet]https://github.com/me/quiet[/url]",
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
      description: "No repository link here.",
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

  it("carries the labelled source repository", () => {
    const records = toRecords(dependents, details);
    expect(records[1].sourceUrl).toBe("https://github.com/me/quiet");
    expect(records[0].sourceUrl).toBeNull();
  });
});

// Real descriptions from Nexus Mods, whose line breaks arrive as <br />.
describe("extractSource", () => {
  const biggerGrids =
    "Built natively on Linux with my " +
    "[url=https://github.com/SavageCore/AMUMSS/tree/feat/linux-support]AMUMSS Linux port[/url]." +
    "<br />Source: [url=https://github.com/SavageCore/bigger-item-grids-and-smaller-inventory-slots]" +
    "https://github.com/SavageCore/bigger-item-grids-and-smaller-inventory-slots[/url]";
  const introSkip =
    "[b]Requires:[/b] the [url=https://www.nexusmods.com/games/nomanssky/mods/4700]" +
    "Nozavolochen Framework[/url]." +
    "<br />Source: [url=https://github.com/SavageCore/nms-intro-skip]" +
    "https://github.com/SavageCore/nms-intro-skip[/url]";

  it("takes the labelled link, not an earlier build-tool link", () => {
    expect(extractSource(biggerGrids)).toBe(
      "https://github.com/SavageCore/bigger-item-grids-and-smaller-inventory-slots",
    );
  });

  it("finds a label below other content", () => {
    expect(extractSource(introSkip)).toBe(
      "https://github.com/SavageCore/nms-intro-skip",
    );
  });

  it("normalizes a tree path to the repository root", () => {
    expect(extractSource("Repo: https://github.com/me/mod/tree/main/src")).toBe(
      "https://github.com/me/mod",
    );
  });

  it("accepts markup around the label", () => {
    expect(extractSource("[b]Source[/b]: https://github.com/me/mod")).toBe(
      "https://github.com/me/mod",
    );
  });

  it("ignores the framework and docs repositories", () => {
    expect(
      extractSource("Source: https://github.com/Nozavolochen/framework"),
    ).toBeNull();
    expect(
      extractSource("Repository: https://github.com/Nozavolochen/docs"),
    ).toBeNull();
  });

  it("refuses to guess from an unlabelled link", () => {
    expect(
      extractSource(
        "Read more at https://github.com/me/mod and closed-source notes.",
      ),
    ).toBeNull();
  });

  it("returns null when there is no description or no link", () => {
    expect(extractSource(undefined)).toBeNull();
    expect(extractSource("")).toBeNull();
    expect(extractSource("Source: none yet")).toBeNull();
  });
});
