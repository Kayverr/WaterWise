import {
  generateReportService,
  fetchReportsService,
  fetchReportByIdService,
} from "../services/reportService.js";
import { getReportFile } from "../models/aiReportModel.js";

export async function generateReport(req, res) {
  try {
    const { type, startDate, endDate, sections, data } = req.body;
    const result = await generateReportService({
      type,
      startDate,
      endDate,
      sections,
      data,
    });

    return res.status(201).json({
      message: "Report generated successfully.",
      data: result.report,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function getReports(_req, res) {
  try {
    return res.status(200).json({ data: await fetchReportsService() });
  } catch {
    return res.status(500).json({ message: "Failed to retrieve reports." });
  }
}

export async function getReport(req, res) {
  try {
    const report = await fetchReportByIdService(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    return res.status(200).json({ data: report });
  } catch {
    return res.status(500).json({ message: "Failed to retrieve report." });
  }
}

export async function downloadReport(req, res) {
  try {
    const pdf = await getReportFile(req.params.id);

    if (!pdf) {
      return res.status(404).json({ message: "PDF file not found." });
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="report-${req.params.id}.pdf"`,
      "Content-Length": pdf.length,
    });

    return res.send(pdf);
  } catch {
    return res.status(500).json({ message: "Failed to download report." });
  }
}
