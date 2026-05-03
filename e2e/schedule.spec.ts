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
