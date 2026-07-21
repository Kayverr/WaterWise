import { fetchAllBilling } from "../services/billing.service.js";

export async function getCurrentBilling(req, res) {
  try {
    const billingRecords = await fetchAllBilling(req.user.id);
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

export async function getBillingHistory(req, res) {
  try {
    const billingRecords = await fetchAllBilling(req.user.id);

    return res.status(200).json(billingRecords);
  } catch {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Unable to retrieve billing history.",
    });
  }
}
