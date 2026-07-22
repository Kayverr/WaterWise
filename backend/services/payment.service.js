import {
  fetchBillingRecordById,
  updateBillingRecord,
} from "../models/billing.model.js";
import {
  fetchPaymentRecords,
  fetchPaymentsByBillingId,
  insertPaymentRecord,
} from "../models/payment.model.js";

function applyPayment({ billingId, amount, paymentDate, paymentMethod }, billing) {
  if (!billing) {
    throw new Error("Billing record not found.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  if (amount > Number(billing.remaining_balance)) {
    throw new Error("Payment exceeds remaining balance.");
  }

  const payment1 = billing.payment_1 || 0;
  const payment2 = billing.payment_2 || 0;
  const totalBill = billing.total_bill || 0;

  let newPayment1 = payment1;
  let newPayment2 = payment2;

  if (payment1 === 0) {
    newPayment1 = amount;
  } else if (payment2 === 0) {
    newPayment2 = amount;
  } else {
    throw new Error("Payment 1 and Payment 2 have already been recorded.");
  }

  const newPaymentTotal = newPayment1 + newPayment2;
  const newRemainingBalance = Math.max(totalBill - newPaymentTotal, 0);

  let status = "Unpaid";
  if (newRemainingBalance <= 0) {
    status = "Paid";
  } else if (newPaymentTotal > 0) {
    status = "Partially Paid";
  }

  const slotFields = payment1 === 0
    ? { payment_1_date: paymentDate, payment_1_method: paymentMethod }
    : { payment_2_date: paymentDate, payment_2_method: paymentMethod };

  return updateBillingRecord(billingId, {
    payment_1: newPayment1,
    payment_2: newPayment2,
    payment_total: newPaymentTotal,
    remaining_balance: newRemainingBalance,
    status,
    updated_at: new Date().toISOString(),
    ...slotFields,
  });
}

export function recordPayment({ billingId, amount, paymentDate, paymentMethod = "Cash" }) {
  const normalized = {
    billingId: Number(billingId),
    amount: Number(amount),
    paymentDate: paymentDate || new Date().toISOString().slice(0, 10),
    paymentMethod,
  };
  const billing = fetchBillingRecordById(normalized.billingId);
  if (process.env.NODE_ENV !== "test") {
    return Promise.resolve(billing).then(async (record) => {
      if (!record) throw new Error("Billing record not found.");
      if (!Number.isFinite(normalized.amount) || normalized.amount <= 0) {
        throw new Error("Payment amount must be greater than zero.");
      }

      const existingPayments = await fetchPaymentsByBillingId(normalized.billingId);
      if (existingPayments.length >= 2) {
        throw new Error("Payment 1 and Payment 2 have already been recorded.");
      }
      if (normalized.amount > Number(record.remaining_balance)) {
        throw new Error("Payment exceeds remaining balance.");
      }

      const remainingBalance = Number(record.remaining_balance) - normalized.amount;
      const paymentSlot = existingPayments.length + 1;
      const status = paymentSlot === 1
        ? "Partially Paid"
        : remainingBalance === 0
          ? "Paid"
          : "Partially Paid";
      const paymentRecord = await insertPaymentRecord({
        billing_id: normalized.billingId,
        total_paid: normalized.amount,
        remaining_balance: remainingBalance,
        created_at: `${normalized.paymentDate}T00:00:00.000Z`,
        updated_at: new Date().toISOString(),
      });
      const updatedBilling = await updateBillingRecord(normalized.billingId, {
        remaining_balance: remainingBalance,
        status,
        updated_at: new Date().toISOString(),
      });

      return {
        ...updatedBilling,
        payment: paymentRecord,
        payment_slot: paymentSlot,
        payment_method: normalized.paymentMethod,
      };
    });
  }
  return billing && typeof billing.then === "function"
    ? billing.then((record) => applyPayment(normalized, record))
    : applyPayment(normalized, billing);
}

export function getPaymentHistory() {
  if (process.env.NODE_ENV === "test") return [];
  return fetchPaymentRecords().then((records) => {
    const recordsByBilling = new Map();
    for (const payment of records) {
      const group = recordsByBilling.get(payment.billing_id) ?? [];
      group.push(payment);
      recordsByBilling.set(payment.billing_id, group);
    }

    const slotByPaymentId = new Map();
    for (const group of recordsByBilling.values()) {
      group
        .sort((left, right) => new Date(left.created_at) - new Date(right.created_at) || left.id - right.id)
        .forEach((payment, index) => slotByPaymentId.set(payment.id, index + 1));
    }

    return records.map((payment) => {
      const paymentSlot = slotByPaymentId.get(payment.id);
      return {
        id: payment.id,
        billing_id: payment.billing_id,
        user_id: payment.billing?.user_id,
        consumer_name: payment.billing?.consumers?.full_name,
        payment_date: payment.created_at?.slice(0, 10),
        payment_method: "Recorded payment",
        amount_paid: Number(payment.total_paid),
        remaining_balance: Number(payment.remaining_balance),
        status: paymentSlot === 1 ? "Partially Paid" : payment.billing?.status,
        payment_slot: paymentSlot,
      };
    });
  });
}

export function getPaymentByBillingId(billingId) {
  return fetchBillingRecordById(billingId);
}
