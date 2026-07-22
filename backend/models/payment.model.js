import { paymentTransactions } from "../data/paymentData.js";
import { supabase } from "../config/supabase.js";

function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

export function fetchPayments() {
  return paymentTransactions;
}

export function fetchPaymentById(paymentId) {
  return paymentTransactions.find(
    (payment) =>
      payment.paymentId === paymentId
  );
}

export function createPayment(payment) {
  paymentTransactions.push(payment);

  return payment;
}

export async function fetchPaymentRecords() {
  const result = await supabase
    .from("payments")
    .select("*, billing(*, consumption(*), consumers!billing_user_id_fkey(full_name, purok_no))")
    .order("created_at", { ascending: false });
  return unwrap(result) ?? [];
}

export async function fetchPaymentsByBillingId(billingId) {
  const result = await supabase
    .from("payments")
    .select("*")
    .eq("billing_id", billingId)
    .order("created_at", { ascending: true });
  return unwrap(result) ?? [];
}

export async function insertPaymentRecord(payment) {
  const result = await supabase
    .from("payments")
    .insert(payment)
    .select("*")
    .single();
  return unwrap(result);
}
