import { useState } from "react";
import { FileText } from "lucide-react";
import GeneratedReportsTable from "../components/GeneratedReportsTable";
import ReportGenerator from "../components/ReportGenerator";

function Reports() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:p-8">
        <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">Document center</span><h1 className="mt-4 flex items-center gap-2 text-3xl font-extrabold tracking-tight">
          <FileText />
          Report Generation
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Generate, preview, download, print, and manage system reports.
        </p>
      </header>

      <ReportGenerator onGenerated={() => setRefreshKey((key) => key + 1)} />
      <GeneratedReportsTable refreshKey={refreshKey} />
    </div>
  );
}

export default Reports;
