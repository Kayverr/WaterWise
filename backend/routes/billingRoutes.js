import express from "express";

import {
  getBillingHistory,
  getCurrentBilling,
  getBillingById,
  createBilling,
  updateBilling,
  deleteBilling,
  recordPayment,
} from "../controllers/billingController.js";

const router = express.Router();

router.get("/api/billing/current", getCurrentBilling);
router.get("/api/billing/history", getBillingHistory);
router.get("/api/billing/:id", getBillingById);
router.post("/api/billing", createBilling);
router.put("/api/billing/:id", updateBilling);
router.patch("/api/billing/:id", updateBilling);
router.delete("/api/billing/:id", deleteBilling);
router.post("/api/billing/payment", recordPayment);

export default router;
