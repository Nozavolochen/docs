import { test, expect } from "@playwright/test";

// All URLs are base-aware: the site serves under /docs/.

test("homepage introduces the framework", async ({ page }) => {
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Nozavolochen", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /install/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/users\/install\/$/);
});

test("homepage lists mods built on the framework", async ({ page }) => {
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Mods built on Nozavolochen" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Bigger Item Grids" }),
  ).toHaveAttribute("href", /nexusmods\.com\/nomanssky\/mods\/4697/);
  await expect(
    page.getByRole("link", {
      name: "SavageCore/bigger-item-grids-and-smaller-inventory-slots",
    }),
  ).toHaveAttribute(
    "href",
    "https://github.com/SavageCore/bigger-item-grids-and-smaller-inventory-slots",
  );
});

test("spec reference loads directly", async ({ page }) => {
  await page.goto("./authors/spec/");
  await expect(
    page.getByRole("heading", { name: "Spec reference" }).first(),
  ).toBeVisible();
});

test("llms.txt is discoverable and lists the documentation sets", async ({
  page,
}) => {
  await page.goto("./");
  await expect(
    page.locator('link[rel="alternate"][href="/docs/llms.txt"]'),
  ).toHaveCount(1);

  const response = await page.request.get("./llms.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("# Nozavolochen");
  expect(body).toContain("/docs/_llms-txt/mod-authoring.txt");
});

test("llms-full.txt carries the mod sources", async ({ page }) => {
  const response = await page.request.get("./llms-full.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("## Mods built on Nozavolochen");
  expect(body).toContain("https://github.com/SavageCore/nms-intro-skip");
});

test("narrow viewport has no horizontal overflow", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
  });
  const page = await context.newPage();
  for (const route of ["./", "./users/install/", "./authors/spec/"]) {
    await page.goto(route);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  }
  await context.close();
});
