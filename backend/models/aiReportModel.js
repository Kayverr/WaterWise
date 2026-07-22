import { supabase } from "../config/supabase.js";

const TABLE = "generated_reports";
const REPORT_FIELDS =
  "id, title, type, start_date, end_date, sections, created_at";

function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

function isMissingReportsTable(error) {
  return (
    error?.code === "PGRST205" ||
    error?.code === "42P01" ||
    String(error?.message ?? "").includes(`Could not find the table 'public.${TABLE}'`)
  );
}

function encodePdf(file) {
  if (!Buffer.isBuffer(file)) {
    throw new TypeError("The generated report file must be a Buffer.");
  }

  // PostgreSQL bytea's hex input format is safe to send through PostgREST JSON.
  return `\\x${file.toString("hex")}`;
}

function decodePdf(file) {
  if (!file) return null;
  if (Buffer.isBuffer(file)) return file;

  if (typeof file === "string") {
    return file.startsWith("\\x")
      ? Buffer.from(file.slice(2), "hex")
      : Buffer.from(file, "base64");
  }

  if (file.type === "Buffer" && Array.isArray(file.data)) {
    return Buffer.from(file.data);
  }

  throw new TypeError("The stored report file has an unsupported format.");
}

export async function saveReport({
  title,
  type,
  startDate,
  endDate,
  sections = [],
  file,
}) {
  const result = await supabase
    .from(TABLE)
    .insert({
      title,
      type,
      start_date: startDate,
      end_date: endDate,
      sections,
      pdf_file: encodePdf(file),
    })
    .select(REPORT_FIELDS)
    .single();

  if (isMissingReportsTable(result.error)) {
    throw new Error(
      "Report storage is not initialized. Apply backend/db/migration.sql to the Supabase project.",
    );
  }

  return unwrap(result);
}

export async function getReports() {
  const result = await supabase
    .from(TABLE)
    .select(REPORT_FIELDS)
    .order("created_at", { ascending: false });

  if (isMissingReportsTable(result.error)) return [];
  return unwrap(result) ?? [];
}

export async function getReportById(id) {
  const result = await supabase
    .from(TABLE)
    .select(REPORT_FIELDS)
    .eq("id", id)
    .maybeSingle();

  return unwrap(result);
}

export async function getReportFile(id) {
  const result = await supabase
    .from(TABLE)
    .select("pdf_file")
    .eq("id", id)
    .maybeSingle();

  const report = unwrap(result);
  return report ? decodePdf(report.pdf_file) : null;
}

export async function clearReports() {
  const result = await supabase.from(TABLE).delete().not("id", "is", null);
  unwrap(result);
}
