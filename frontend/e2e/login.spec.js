import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login form", async ({ page }) => {
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page.getByText(/email.*required/i)).toBeVisible();
    await expect(page.getByText(/password.*required/i)).toBeVisible();
  });

  test("should successfully login as admin", async ({ page }) => {
    // Mock API response
    await page.route("**/api/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 1,
              nama: "Admin Test",
              email: "admin@test.com",
              role: "admin",
            },
            token: "fake-jwt-token",
          },
        }),
      });
    });

    // Fill form
    await page.getByPlaceholder(/email/i).fill("admin@test.com");
    await page.getByPlaceholder(/password/i).fill("password123");

    // Submit
    await page.getByRole("button", { name: /login/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.getByText(/dashboard admin/i)).toBeVisible();
  });

  test("should show error on invalid credentials", async ({ page }) => {
    // Mock error response
    await page.route("**/api/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Email atau password salah",
        }),
      });
    });

    // Fill form
    await page.getByPlaceholder(/email/i).fill("wrong@test.com");
    await page.getByPlaceholder(/password/i).fill("wrongpass");

    // Submit
    await page.getByRole("button", { name: /login/i }).click();

    // Should show error
    await expect(page.getByText(/email atau password salah/i)).toBeVisible();

    // Should remain on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test("should toggle password visibility", async ({ page }) => {
    const passwordInput = page.getByPlaceholder(/password/i);
    const toggleButton = page.getByRole("button", { name: /toggle.*password/i });

    // Initially password type
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Toggle to show
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Toggle to hide
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should disable submit button while loading", async ({ page }) => {
    // Mock slow response
    await page.route("**/api/login", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({}),
      });
    });

    await page.getByPlaceholder(/email/i).fill("admin@test.com");
    await page.getByPlaceholder(/password/i).fill("password123");

    const submitButton = page.getByRole("button", { name: /login/i });
    await submitButton.click();

    // Button should be disabled while loading
    await expect(submitButton).toBeDisabled();
  });
});

test.describe("Authenticated User", () => {
  test.beforeEach(async ({ page }) => {
    // Set auth token
    await page.addInitScript(() => {
      localStorage.setItem("token", "fake-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 1,
          nama: "Admin",
          email: "admin@test.com",
          role: "admin",
        })
      );
    });
  });

  test("should redirect to dashboard when accessing login", async ({ page }) => {
    await page.goto("/login");

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test("should logout successfully", async ({ page }) => {
    await page.goto("/admin/dashboard");

    // Mock logout API
    await page.route("**/api/logout", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    // Click logout
    await page.getByRole("button", { name: /logout/i }).click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeNull();
  });
});
