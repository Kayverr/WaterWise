import express from "express";
import {
  generateReport,
  getReports,
  getReport,
  downloadReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/generate", generateReport);
router.get("/", getReports);
router.get("/:id/download", downloadReport);
router.get("/:id", getReport);

export default router;
