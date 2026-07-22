import { consumerModel } from "../models/consumerModel.js";

function serviceError(code, message) {
  return Object.assign(new Error(message), { code });
}

export const consumerService = {
  async createConsumer(payload = {}) {
    const username = String(payload.username ?? payload.accountName ?? "").trim();
    const fullName = String(payload.fullName ?? payload.full_name ?? "").trim();
    const email = String(payload.email ?? "").trim().toLowerCase();
    const password = String(payload.password ?? "");
    const purokValue = String(payload.purokNo ?? payload.purok_no ?? payload.purok ?? "");
    const purokNo = Number(purokValue.replace(/\D/g, ""));
    const errors = {};

    if (!username) errors.username = "Username is required.";
    if (!fullName) errors.fullName = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "A valid email is required.";
    if (!Number.isInteger(purokNo) || purokNo < 1) errors.purokNo = "A valid purok number is required.";
    if (!password) errors.password = "Password is required.";

    if (Object.keys(errors).length) {
      throw Object.assign(new Error("Consumer validation failed."), {
        code: "VALIDATION_ERROR",
        errors,
      });
    }

    return consumerModel.create({
      username,
      fullName,
      email,
      purokNo,
      password,
      status: payload.status ?? "active",
    });
  },

  async updateConsumer(id, payload = {}) {
    const username = String(payload.username ?? payload.accountName ?? "").trim();
    const fullName = String(payload.fullName ?? payload.full_name ?? "").trim();
    const email = String(payload.email ?? "").trim().toLowerCase();
    const password = String(payload.password ?? "");
    const purokNo = Number(String(payload.purokNo ?? payload.purok_no ?? payload.purok ?? "").replace(/\D/g, ""));
    const errors = {};
    if (!username) errors.username = "Username is required.";
    if (!fullName) errors.fullName = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "A valid email is required.";
    if (!Number.isInteger(purokNo) || purokNo < 1) errors.purokNo = "A valid purok number is required.";
    if (Object.keys(errors).length) throw Object.assign(new Error("Consumer validation failed."), { code: "VALIDATION_ERROR", errors });
    const consumer = await consumerModel.update(id, { username, fullName, email, purokNo, password });
    if (!consumer) throw Object.assign(new Error("Consumer not found."), { code: "CONSUMER_NOT_FOUND" });
    return consumer;
  },

  async getProfile(profileId) {
    if (!profileId) {
      throw serviceError("UNAUTHORIZED", "An authenticated consumer is required.");
    }

    const profile = await consumerModel.findProfile(profileId, profileId);

    if (!profile) {
      throw serviceError("PROFILE_NOT_FOUND", "Profile record could not be found.");
    }

    const [readings, invoices] = await Promise.all([
      consumerModel.findReadings(profileId, profileId),
      consumerModel.findInvoices(profileId, profileId),
    ]);

    return {
      ...profile,
      readings,
      invoices,
    };
  },
};
