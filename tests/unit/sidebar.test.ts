// Every sidebar slug in astro.config.mjs must resolve to a content
// file, or the nav links 404. Parsed as text so the test stays free of
// the Astro toolchain.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const config = readFileSync(join(root, "astro.config.mjs"), "utf8");
const slugs = [...config.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

function slugFile(slug: string): string | null {
  for (const ext of [".md", ".mdx"]) {
    const p = join(root, "src", "content", "docs", `${slug}${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
}

describe("sidebar", () => {
  it("declares slugs", () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it("every slug has a content file", () => {
    for (const slug of slugs) {
      expect(slugFile(slug), `missing content for slug ${slug}`).not.toBeNull();
    }
  });

  it("every docs page is in the sidebar", () => {
    const pages: string[] = [];
    const walk = (dir: string, prefix: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) walk(join(dir, e.name), `${prefix}${e.name}/`);
        else if (/\.mdx?$/.test(e.name))
          pages.push(prefix + e.name.replace(/\.mdx?$/, ""));
      }
    };
    walk(join(root, "src", "content", "docs"), "");
    for (const page of pages) {
      expect(slugs, `unlinked page ${page}`).toContain(page);
    }
  });
});
