"use client";

import { useEffect, useState } from "react";
import { X, ShieldCheck, FileText, Zap, CheckCircle2, Printer, Loader2, AlertCircle } from "lucide-react";

interface AppraisalReportProps {
  company: any;
  onClose: () => void;
}

export default function AppraisalReport({ company, onClose }: AppraisalReportProps) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!company?.id) return;
    setLoading(true);
    setError(null);

    fetch(`/api/companies/${company.id}/report`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Report fetch failed");
        setReport(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [company?.id]);

  const name = company?.name || "Unknown Entity";
  const now = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#040610]/95 backdrop-blur-xl" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#080e26]/80 border border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.15)] rounded-[2.5rem] overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 lg:p-8 pb-0 flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">
              <FileText className="w-4 h-4" /> Credit Appraisal Report
            </div>
            <div>
              <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tighter">{name}</h2>
              <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mt-2 flex flex-wrap gap-3">
                <span>Sector: {company?.sector || "—"}</span>
                <span>{now}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5">
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 lg:p-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-slate-400 text-sm">Generating AI Appraisal Report...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <AlertCircle className="w-8 h-8 text-amber-500" />
              <p className="text-slate-400 text-sm text-center max-w-sm">
                {error === "No score record" || error?.includes("score")
                  ? "No analysis available yet. Please upload financial documents (Bank Statement / Balance Sheet) first to generate this report."
                  : error}
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg"
              >
                Upload Documents
              </button>
            </div>
          )}

          {report && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
              {/* Score Gauge */}
              <div className="md:col-span-4 bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                    <circle
                      cx="80" cy="80" r="72"
                      stroke="currentColor" strokeWidth="10" fill="transparent"
                      strokeDasharray={452}
                      strokeDashoffset={452 * (1 - (report.score / 100))}
                      className={`transition-all duration-1000 ${report.score > 75 ? "text-emerald-500" : report.score > 50 ? "text-amber-500" : "text-red-500"}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white">{report.score}</span>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">/100</span>
                    <span className={`font-black text-lg mt-1 ${report.score > 75 ? "text-emerald-500" : report.score > 50 ? "text-amber-400" : "text-red-400"}`}>
                      {report.rating}
                    </span>
                  </div>
                </div>
                <div>
                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest justify-center ${report.score > 75 ? "text-emerald-500" : report.score > 50 ? "text-amber-400" : "text-red-400"}`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${report.score > 75 ? "bg-emerald-500" : report.score > 50 ? "bg-amber-400" : "bg-red-400"}`} />
                    {report.score > 75 ? "Low Risk" : report.score > 50 ? "Medium Risk" : "High Risk"}
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Credit Rating</p>
                </div>
              </div>

              {/* Right: Insights */}
              <div className="md:col-span-8 space-y-6">
                <div className={`border rounded-2xl p-5 relative overflow-hidden ${report.recommendation?.includes("APPROVE") ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-3 ${report.recommendation?.includes("APPROVE") ? "text-emerald-500" : "text-red-400"}`}>
                    <CheckCircle2 className="w-4 h-4" /> AI Recommendation
                  </div>
                  <div className={`inline-block px-4 py-2 rounded font-black text-xs uppercase tracking-widest ${report.recommendation?.includes("APPROVE") ? "bg-emerald-500 text-black" : "bg-red-500 text-white"}`}>
                    {report.recommendation || "—"}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 border-t border-white/10 pt-5">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Credit Limit</p>
                      <p className="text-lg font-black text-white mt-1">{report.creditLimit}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Tenor</p>
                      <p className="text-lg font-black text-emerald-400 mt-1">{report.tenor}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">ROI (p.a.)</p>
                      <p className="text-lg font-black text-emerald-500 mt-1">{report.roi}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Probability of Default</p>
                    <p className="text-lg font-black text-teal-400 mt-1">{report.pd}</p>
                  </div>
                </div>

                {/* Health bars */}
                <div className="space-y-4">
                  {[
                    { label: "Financial Health", value: report.metrics?.financial || 0, color: "from-emerald-600 to-emerald-400" },
                    { label: "Legal Intelligence", value: report.metrics?.legal || 0, color: "from-purple-600 to-purple-400" },
                    { label: "Behavioral Signals", value: report.metrics?.behavioral || 0, color: "from-teal-600 to-teal-400" },
                  ].map((bar, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black border-l-2 border-white/10 pl-3">
                        <span className="text-slate-400 uppercase tracking-widest">{bar.label}</span>
                        <span className="text-white">{bar.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${bar.color} transition-all duration-1000`} style={{ width: `${bar.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Summary */}
          {report?.summary && (
            <div className="mt-6 p-6 bg-black/40 border border-white/5 rounded-3xl">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-4 h-4 text-emerald-500" />
                <h4 className="text-sm font-black text-white uppercase tracking-widest">AI Explainability Engine</h4>
                <span className="bg-purple-500/20 text-purple-400 text-[8px] font-black px-2 py-0.5 rounded border border-purple-500/20">XAI</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{report.summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
