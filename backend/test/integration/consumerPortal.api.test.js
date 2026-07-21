import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../app.js";
import { notificationModel } from "../../models/notificationModel.js";
import { clearSession } from "../../services/AuthService.js";

describe("In-memory consumer portal API", () => {
  beforeEach(() => {
    clearSession();
    notificationModel.__resetStorage();
  });

  async function signIn() {
    const response = await request(app).post("/api/auth/login").send({
      email: "tenant@gmail.com",
      password: "tenant123",
    });

    expect(response.status).toBe(200);
  }

  it("returns profile, billing, notifications, and consumption for the active consumer", async () => {
    await signIn();

    const [profile, currentBilling, history, notifications, consumption] =
      await Promise.all([
        request(app).get("/api/profile"),
        request(app).get("/api/billing/current"),
        request(app).get("/api/billing/history"),
        request(app).get("/api/notifications"),
        request(app).get("/api/consumption"),
      ]);

    expect(profile.status).toBe(200);
    expect(profile.body).toMatchObject({ id: 2, name: "Juan Dela Cruz" });
    expect(profile.body.readings[0]).toMatchObject({
      reading_date: "2026-07-01",
      consumption: 22.7,
    });

    expect(currentBilling.body).toEqual({ unpaid_balance_total: 450 });
    expect(history.body).toHaveLength(3);
    expect(history.body.every((record) => record.user_id === 2)).toBe(true);

    const notificationRows = [
      ...notifications.body.streams.accountBills,
      ...notifications.body.streams.adminAnnouncements,
    ];
    expect(notificationRows.length).toBeGreaterThan(0);
    expect(notificationRows.every((record) => record.profile_id === 2)).toBe(true);

    expect(consumption.status).toBe(200);
    expect(consumption.body.length).toBeGreaterThan(0);
    expect(consumption.body[0]).toMatchObject({
      month: "2025-01",
      consumption: 140,
    });
  });

  it("rejects portal data requests before sign-in", async () => {
    const responses = await Promise.all([
      request(app).get("/api/profile"),
      request(app).get("/api/billing/current"),
      request(app).get("/api/billing/history"),
      request(app).get("/api/notifications"),
      request(app).get("/api/consumption"),
    ]);

    expect(responses.every((response) => response.status === 401)).toBe(true);
  });
});
