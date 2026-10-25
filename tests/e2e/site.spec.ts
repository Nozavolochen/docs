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
});

test("spec reference loads directly", async ({ page }) => {
  await page.goto("./authors/spec/");
  await expect(
    page.getByRole("heading", { name: "Spec reference" }).first(),
  ).toBeVisible();
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
