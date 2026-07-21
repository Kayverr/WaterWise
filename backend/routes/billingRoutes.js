import express from "express";

import {
  getBillingHistory,
  getCurrentBilling,
} from "../controllers/billingController.js";
import { authenticateWithUser } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/api/billing/current", authenticateWithUser, getCurrentBilling);
router.get("/api/billing/history", authenticateWithUser, getBillingHistory);

export default router;
