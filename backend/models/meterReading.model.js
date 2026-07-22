import { supabase } from "../config/supabase.js";

const columns = "id, consumer_id, reading_date, previous_reading, present_reading, consumption, created_at, consumers(full_name, purok_no)";
export const WATER_RATE_PER_CUBIC_METER = 17;

function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

function formatReading(record) {
  const consumer = record.consumers ?? {};
  return {
    id: record.id,
    consumerId: record.consumer_id,
    consumerNo: `C-${String(record.consumer_id).padStart(4, "0")}`,
    consumerName: consumer.full_name ?? "Unknown consumer",
    purok: consumer.purok_no == null ? "Unassigned" : `Purok ${consumer.purok_no}`,
    previousReading: Number(record.previous_reading),
    currentReading: Number(record.present_reading),
    consumption: Number(record.consumption),
    billAmount: Number(record.consumption) * WATER_RATE_PER_CUBIC_METER,
    readingDate: record.reading_date,
    status: "Recorded",
  };
}

function addDays(date, days) {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

async function syncBilling(record) {
  const totalBill = Number(record.consumption) * WATER_RATE_PER_CUBIC_METER;
  const existing = unwrap(await supabase
    .from("billing")
    .select("id, total_bill, remaining_balance")
    .eq("consumption_id", record.id)
    .maybeSingle());

  if (!existing) {
    unwrap(await supabase.from("billing").insert({
      consumption_id: record.id,
      user_id: record.consumer_id,
      billing_date: record.reading_date,
      due_date: addDays(record.reading_date, 15),
      total_bill: totalBill,
      remaining_balance: totalBill,
      status: "Unpaid",
    }));
    return;
  }

  const amountAlreadyPaid = Math.max(Number(existing.total_bill) - Number(existing.remaining_balance), 0);
  const remainingBalance = Math.max(totalBill - amountAlreadyPaid, 0);
  unwrap(await supabase.from("billing").update({
    user_id: record.consumer_id,
    billing_date: record.reading_date,
    due_date: addDays(record.reading_date, 15),
    total_bill: totalBill,
    remaining_balance: remainingBalance,
    status: remainingBalance === 0 ? "Paid" : amountAlreadyPaid > 0 ? "Partially Paid" : "Unpaid",
    updated_at: new Date().toISOString(),
  }).eq("id", existing.id));
}

// In-memory E2E mock store (matches formatReading shape)
const e2eReadings = [];
let e2eNextId = 999001;

export async function getMeterReadings() {
  if (process.env.WATERWISE_E2E === "true") {
    return e2eReadings.map((r) => ({ ...r }));
  }

  const records = unwrap(
    await supabase.from("consumption").select(columns).order("reading_date", { ascending: false }).order("id", { ascending: false }),
  ) ?? [];
  return records.map(formatReading);
}

export async function getMeterReadingById(id) {
  if (process.env.WATERWISE_E2E === "true") {
    const record = e2eReadings.find((r) => r.id === Number(id));
    return record ? { ...record } : null;
  }

  const record = unwrap(
    await supabase.from("consumption").select(columns).eq("id", id).maybeSingle(),
  );
  return record ? formatReading(record) : null;
}

export async function createMeterReading(reading) {
  if (process.env.WATERWISE_E2E === "true") {
    const record = {
      id: e2eNextId++,
      consumerId: Number(reading.consumerId),
      consumerNo: reading.consumerNo,
      consumerName: reading.consumerName,
      purok: reading.purok,
      previousReading: Number(reading.previousReading),
      currentReading: Number(reading.currentReading),
      consumption: Number(reading.currentReading) - Number(reading.previousReading),
      billAmount: (Number(reading.currentReading) - Number(reading.previousReading)) * WATER_RATE_PER_CUBIC_METER,
      readingDate: reading.readingDate,
      status: reading.status || "Recorded",
    };
    e2eReadings.push(record);
    return { ...record };
  }

  const record = unwrap(
    await supabase.from("consumption").insert({
      consumer_id: reading.consumerId,
      reading_date: reading.readingDate,
      previous_reading: reading.previousReading,
      present_reading: reading.currentReading,
    }).select(columns).single(),
  );
  await syncBilling(record);
  return formatReading(record);
}

export async function updateMeterReading(id, reading) {
  if (process.env.WATERWISE_E2E === "true") {
    const index = e2eReadings.findIndex((r) => r.id === Number(id));
    if (index === -1) return null;
    e2eReadings[index] = {
      ...e2eReadings[index],
      previousReading: Number(reading.previousReading),
      currentReading: Number(reading.currentReading),
      consumption: Number(reading.currentReading) - Number(reading.previousReading),
      billAmount: (Number(reading.currentReading) - Number(reading.previousReading)) * WATER_RATE_PER_CUBIC_METER,
      readingDate: reading.readingDate,
      status: reading.status || "Recorded",
    };
    return { ...e2eReadings[index] };
  }

  const record = unwrap(
    await supabase.from("consumption").update({
      reading_date: reading.readingDate,
      previous_reading: reading.previousReading,
      present_reading: reading.currentReading,
    }).eq("id", id).select(columns).maybeSingle(),
  );
  if (record) await syncBilling(record);
  return record ? formatReading(record) : null;
}

export async function deleteMeterReading(id) {
  if (process.env.WATERWISE_E2E === "true") {
    const index = e2eReadings.findIndex((r) => r.id === Number(id));
    if (index !== -1) e2eReadings.splice(index, 1);
    return;
  }

  const { error } = await supabase.from("consumption").delete().eq("id", id);
  if (error) throw error;
}
