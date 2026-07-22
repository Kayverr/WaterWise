import { fetchAllBilling, fetchBilling, generateBillingRecord, processPayment, removeBillingRecord, updateBillingRecord } from "../services/billing.service.js";
import { getCurrentUser } from "../services/AuthService.js";

async function resolveUserId() {
  if (process.env.NODE_ENV === "test") return undefined;
  const user = await getCurrentUser();
  return user.role === "consumer" ? user.id : undefined;
}

export async function getCurrentBilling(_req, res) {
  try {
    const userId = await resolveUserId();
    const billingRecords = await fetchAllBilling(userId);
    const unpaidBalanceTotal = billingRecords.reduce((total, record) => {
      const remainingBalance = Number(record.remaining_balance);

      return remainingBalance > 0 ? total + remainingBalance : total;
    }, 0);

    return res.status(200).json({
      unpaid_balance_total: unpaidBalanceTotal,
    });
  } catch {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Unable to retrieve the current billing balance.",
    });
  }
}

export async function getBillingHistory(_req, res) {
  try {
    const userId = await resolveUserId();
    const billingRecords = await fetchAllBilling(userId);

    return res.status(200).json(billingRecords);
  } catch {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Unable to retrieve billing history.",
    });
  }
}

export async function getBillingById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid billing ID." });
    }

    const billing = await fetchBilling(id);
    if (!billing) {
      return res.status(404).json({ error: "Billing record not found." });
    }

    return res.status(200).json(billing);
  } catch {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Unable to retrieve billing record.",
    });
  }
}

export async function createBilling(req, res) {
  try {
    const { user_id, name, previous_reading, present_reading, billing_date, due_date } = req.body;

    if (!user_id || !name || previous_reading === undefined || present_reading === undefined || !billing_date || !due_date) {
      return res.status(400).json({ error: "Missing required fields: user_id, name, previous_reading, present_reading, billing_date, due_date" });
    }

    const billing = await generateBillingRecord({
      id: 0,
      user_id,
      name,
      previous_reading: Number(previous_reading),
      present_reading: Number(present_reading),
      billing_date,
      due_date,
    });

    return res.status(201).json({ message: "Billing record created successfully.", data: billing });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Unable to create billing record.",
    });
  }
}

export async function updateBilling(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid billing ID." });
    }

    const existing = await fetchBilling(id);
    if (!existing) {
      return res.status(404).json({ error: "Billing record not found." });
    }

    const updated = await updateBillingRecord(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Billing record not found." });
    }

    return res.status(200).json({ message: "Billing record updated successfully.", data: updated });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Unable to update billing record.",
    });
  }
}

export async function deleteBilling(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid billing ID." });
    }

    const existing = await fetchBilling(id);
    if (!existing) {
      return res.status(404).json({ error: "Billing record not found." });
    }

    const deleted = await removeBillingRecord(id);
    if (!deleted) {
      return res.status(404).json({ error: "Billing record not found." });
    }

    return res.status(200).json({ message: "Billing record deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Unable to delete billing record.",
    });
  }
}

export async function recordPayment(req, res) {
  try {
    const { billingId, amount } = req.body;
    if (!billingId || amount === undefined) {
      return res.status(400).json({ error: "Missing required fields: billingId, amount" });
    }

    const result = await processPayment(Number(billingId), Number(amount));
    return res.status(200).json({ message: "Payment recorded successfully.", data: result });
  } catch (error) {
    return res.status(400).json({ error: "Payment failed.", message: error.message });
  }
}
