import { expect, test } from "@playwright/test";

test("user can browse schedule sections on the home page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /P\. LEAGUE\+/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /TPBL/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /BCL/i })).toBeVisible();

  await page.getByRole("button").nth(1).click();
  await expect(page.locator("article").first()).toBeVisible();

  const monthSelect = page.getByRole("combobox").first();
  await expect(monthSelect).toBeVisible();
  await monthSelect.selectOption({ index: 0 });

  const nextPageButton = page
    .getByRole("button")
    .filter({ hasText: /^2$/ })
    .first();

  if (await nextPageButton.isVisible()) {
    await nextPageButton.click();
    await expect(page.locator("article").first()).toBeVisible();
  }
});

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
]) {
  test(`BCL completed games keep the BCL theme at the page bottom on ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/");

    const bclSection = page.locator("#bcl-schedule");
    await bclSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await bclSection.getByRole("button").nth(1).click();
    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });

    await expect
      .poll(() =>
        bclSection.evaluate((node) => getComputedStyle(node).backgroundImage),
      )
      .toContain("rgb(138, 116, 44)");
  });
}
