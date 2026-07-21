import { consumerModel } from "../models/consumerModel.js";

const profiles = new Map([
  [
    2,
    {
      id: 2,
      accountId: "ACC-2",
      name: "Juan Dela Cruz",
      purok: "Purok 3",
      house_number: "41",
      email: "tenant@gmail.com",
      phone: "0917 555 0141",
      meter_number: "SWS-MTR-0412",
      status: "active",
    },
  ],
]);

function serviceError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

async function getProfile(profileId) {
  if (!profileId) {
    throw serviceError("UNAUTHORIZED", "An authenticated profile is required.");
  }

  const profile = profiles.get(profileId);

  if (!profile) {
    throw serviceError("PROFILE_NOT_FOUND", "Profile record could not be found.");
  }

  const [readings, invoices] = await Promise.all([
    consumerModel.findReadings(profileId, profileId),
    consumerModel.findInvoices(profileId, profileId),
  ]);

  return { ...profile, readings, invoices };
}

export const consumerService = { getProfile };
