import {
  getPaymentHistory as fetchPaymentHistory,
  getPaymentByBillingId as fetchPaymentByBillingId,
  recordPayment as recordPaymentService,
} from "../services/payment.service.js";

export async function getPaymentHistory(_req, res) {
  try {
    const payments = await fetchPaymentHistory();
    return res.status(200).json({ data: payments });
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve payment history." });
  }
}

export async function getPaymentByBillingId(req, res) {
  try {
    const billingId = Number(req.params.billingId);
    if (!Number.isInteger(billingId) || billingId <= 0) {
      return res.status(400).json({ message: "A valid billing ID is required." });
    }

    const payment = await fetchPaymentByBillingId(billingId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found for this billing record." });
    }

    return res.status(200).json({ data: payment });
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve payment." });
  }
}

export async function recordPayment(req, res) {
  try {
    const { billingId, amount, paymentDate } = req.body;

    if (!billingId || amount === undefined) {
      return res.status(400).json({ message: "Missing required fields: billingId, amount" });
    }

    const result = await recordPaymentService({
      billingId: Number(billingId),
      amount: Number(amount),
      paymentDate,
      paymentMethod: req.body.paymentMethod,
    });
    return res.status(200).json({ message: "Payment recorded successfully.", data: result });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Unable to record payment." });
  }
}
