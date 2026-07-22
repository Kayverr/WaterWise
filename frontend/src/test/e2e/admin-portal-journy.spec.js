import { expect, test } from "@playwright/test";

test.describe("Admin event management end-to-end journey", () => {
  test("exercises the event form, preview, records, validation, auto-refresh, and CRUD controls", async ({
    page,
  }) => {
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: "Sign in to your account" }),
    ).toBeVisible();
    await page.getByLabel("Email or username").fill("admin@gmail.com");
    await page.getByLabel("Password", { exact: true }).fill("admin123");

    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard$/);

    const initialEventsResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/events/") &&
        response.request().method() === "GET" &&
        response.status() === 200,
    );
    await page.getByRole("link", { name: "Events" }).click();
    await initialEventsResponse;
    await expect(page).toHaveURL(/\/admin\/events$/);
    await expect(page.getByRole("heading", { name: "Event Management" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Create Event" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Selected Event" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Event Records" })).toBeVisible();
    await expect(page.getByText("Barangay Assembly", { exact: true })).toBeVisible();

    const assemblyRow = page.getByRole("row").filter({ hasText: "Barangay Assembly" });
    await expect(assemblyRow).toContainText("Barangay Hall");
    await expect(assemblyRow).toContainText("Upcoming");
    await assemblyRow.getByRole("button", { name: "Edit" }).click();
    await expect(page.getByRole("heading", { name: "Edit Event" })).toBeVisible();
    await expect(page.getByPlaceholder("Event Title")).toHaveValue("Barangay Assembly");
    const selectedEventPreview = page.getByRole("heading", { name: "Selected Event" }).locator("..");
    await expect(selectedEventPreview).toContainText("Barangay Assembly");
    await expect(selectedEventPreview).toContainText("2026-07-10 - 09:00 AM");
    await expect(selectedEventPreview).toContainText("Barangay Hall");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("heading", { name: "Create Event" })).toBeVisible();
    await expect(page.getByPlaceholder("Event Title")).toHaveValue("");

    const invalidResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/events/") &&
        response.request().method() === "POST" &&
        response.status() === 400,
    );
    await page.getByRole("button", { name: "Save Event" }).click();
    await invalidResponse;
    await expect(page.getByRole("alert")).toContainText("Event validation failed.");

    const retryResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/events/") &&
        response.request().method() === "GET" &&
        response.status() === 200,
    );
    await page.getByRole("button", { name: "Try again" }).click();
    await retryResponse;
    await expect(page.getByRole("alert")).toHaveCount(0);

    const eventTitle = "Water Conservation Seminar";
    const updatedTitle = "Water Conservation Workshop";

    await page.getByPlaceholder("Event Title").fill(eventTitle);
    await page.getByPlaceholder("Event Description").fill(
      "A practical seminar about reducing household water consumption.",
    );
    await page.locator('input[name="date"]').fill("2026-08-20");
    await page.locator('input[name="time"]').fill("09:30");
    await page.getByPlaceholder("Location").fill("Barangay Hall");
    await page.getByPlaceholder("Event Tags").fill("Conservation, Community");

    const createResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/events/") &&
        response.request().method() === "POST" &&
        response.status() === 201,
    );
    await page.getByRole("button", { name: "Save Event" }).click();
    await createResponse;

    const createdRow = page.getByRole("row").filter({ hasText: eventTitle });
    await expect(createdRow).toBeVisible();
    await expect(createdRow).toContainText("2026-08-20 - 09:30");
    await expect(createdRow).toContainText("ConservationCommunity");

    await createdRow.getByRole("button", { name: "Edit" }).click();
    await expect(page.getByRole("heading", { name: "Edit Event" })).toBeVisible();
    await expect(page.getByPlaceholder("Event Title")).toHaveValue(eventTitle);
    await page.getByPlaceholder("Event Title").fill(updatedTitle);

    const updateResponse = page.waitForResponse(
      (response) =>
        /\/api\/events\/\d+$/.test(new URL(response.url()).pathname) &&
        response.request().method() === "PUT" &&
        response.status() === 200,
    );
    await page.getByRole("button", { name: "Update Event" }).click();
    await updateResponse;

    const updatedRow = page.getByRole("row").filter({ hasText: updatedTitle });
    await expect(updatedRow).toBeVisible();
    await expect(page.getByText(eventTitle, { exact: true })).toHaveCount(0);

    const deleteResponse = page.waitForResponse(
      (response) =>
        /\/api\/events\/\d+$/.test(new URL(response.url()).pathname) &&
        response.request().method() === "DELETE" &&
        response.status() === 200,
    );
    await updatedRow.getByRole("button", { name: "Delete" }).click();
    await deleteResponse;
    await expect(page.getByText(updatedTitle, { exact: true })).toHaveCount(0);

    await expect(page.getByRole("button", { name: "Refresh events" })).toHaveCount(0);
    await expect(page.getByText("Barangay Assembly", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Open account menu" }).click();
    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.getByLabel("Email or username").fill("meterreader@gmail.com");
    await page.getByLabel("Password", { exact: true }).fill("meterreader123");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page).toHaveURL(/\/meter-reader\/readings-entry$/);
    await expect(
      page.getByRole("heading", { name: "Record Consumption Entry" }),
    ).toBeVisible();

    // Wait for consumer directory and readings to load
    await expect(page.getByText("Juan Dela Cruz")).toBeVisible();

    // Search for a consumer
    await page.getByPlaceholder("Search consumer name, number, or purok").fill("Juan");

    // Select the consumer
    await page.getByRole("button", { name: /Juan Dela Cruz/ }).click();

    // Verify consumption entry panel appears with consumer info
    await expect(page.getByText("Selected consumer")).toBeVisible();

    // Fill in current reading
    await page.locator("label").filter({ hasText: "Current reading" }).locator("input").fill("350");

    const readingCreateResponse = page.waitForResponse(
      (response) =>
        response.url().includes("/meter-readings") &&
        response.request().method() === "POST" &&
        response.status() === 201,
    );
    await page.getByRole("button", { name: "Save consumption record" }).click();
    await readingCreateResponse;

    // Verify success message
    await expect(page.getByRole("status")).toContainText("recorded successfully");

    // Recent records were intentionally removed; successful save closes the entry dialog.
    await expect(page.getByRole("dialog", { name: "Record consumption dialog" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Juan Dela Cruz/ })).toBeVisible();

    expect(pageErrors).toEqual([]);
  });
});
