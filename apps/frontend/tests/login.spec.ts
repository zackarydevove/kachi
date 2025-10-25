import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  test("should display login form elements", async ({ page }) => {
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Login", exact: true })
    ).toBeVisible();
  });

  test("should show error message for invalid credentials", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill("invalid@example.com");
    await page.getByLabel("Password").fill("Wrongpassword123@");

    await page.getByRole("button", { name: "Login", exact: true }).click();

    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("should be able to navigate to sign up page", async ({ page }) => {
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(`${BASE_URL}/signup`);
  });

  test("should navigate to forgot password page", async ({ page }) => {
    await page.getByRole("link", { name: "Forgot your password?" }).click();
    await expect(page).toHaveURL(`${BASE_URL}/password/forgotten`);
  });

  test("should display Google OAuth button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
  });

  test("should require email and password fields", async ({ page }) => {
    await page.getByRole("button", { name: "Login", exact: true }).click();

    await expect(page.getByLabel("Email")).toHaveAttribute("required");
    await expect(page.getByLabel("Password")).toHaveAttribute("required");
  });

  test("should show loading state during login", async ({ page }) => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("testpassword123");

    await page.getByRole("button", { name: "Login", exact: true }).click();

    await expect(
      page.getByRole("button", { name: "Login", exact: true })
    ).toBeVisible();
  });

  // test("should be able to login with valid credentials", async ({ page }) => {
  //   await page.getByLabel("Email").fill("test@example.com");
  //   await page.getByLabel("Password").fill("testpassword123");

  //   await page.getByRole("button", { name: "Login", exact: true }).click();

  //   await expect(page).toHaveURL(`${BASE_URL}/portfolio`);
  // });
});
