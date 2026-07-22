import express from "express";

import {
  getPaymentHistory,
  getPaymentByBillingId,
  recordPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/api/payments", getPaymentHistory);
router.post("/api/payments", recordPayment);
router.get("/api/payments/billing/:billingId", getPaymentByBillingId);

export default router;