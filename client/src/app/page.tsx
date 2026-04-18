import Link from "next/link";
import { Brain, ArrowRight, BarChart3, Zap, ShieldCheck, FileText, Upload, Activity, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#040610] text-white selection:bg-emerald-500/30 font-sans tracking-tight overflow-x-hidden">
      {/* Dynamic Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] -z-10" />

      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden -z-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-black text-lg tracking-tight">AETHER</span>
              <span className="text-emerald-500 text-[10px] tracking-[0.3em] font-normal">CREDIT</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-white/10 mx-2" />
            <div className="hidden md:block bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              AI-Powered
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest mr-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Agents Online
              </div>
            </div>
            <Link
              href="/login"
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 lg:px-6 py-2.5 rounded-lg text-sm font-black transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-2"
            >
              Launch <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 lg:px-10 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-8 space-y-10 lg:space-y-12">
            {/* Hero */}
            <div className="space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <Activity className="w-3.5 h-3.5 fill-emerald-500" /> 5 Specialized AI Agents • Real-Time • Explainable
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-white">
                Next-Gen Corporate <br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Credit Intelligence</span>
              </h1>
              <p className="text-base lg:text-lg text-slate-400 leading-relaxed font-normal max-w-2xl">
                Our AI agent network simultaneously processes financial, legal, and behavioral data to predict risk before it surfaces. Decisions in seconds. Accuracy at scale.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                {[
                  { val: "12,847+", label: "Analyses Run", color: "text-white" },
                  { val: "97.3%", label: "Accuracy Rate", color: "text-emerald-500" },
                  { val: "8s", label: "Avg Processing", color: "text-white" },
                  { val: "47", label: "Data Points", color: "text-emerald-500" },
                ].map((s, i) => (
                  <div key={i} className="space-y-1">
                    <p className={`text-2xl lg:text-3xl font-black tracking-tighter ${s.color}`}>{s.val}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingestion Console */}
            <div className="bg-[#080e26]/40 border border-white/5 rounded-[2rem] p-6 lg:p-10 space-y-6 lg:space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-[100px]" />

              <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 relative z-10">
                <div>
                  <h2 className="text-xl lg:text-2xl font-black text-white">Data Ingestion Console</h2>
                  <p className="text-slate-500 text-sm font-medium">Upload financial documents to begin AI analysis</p>
                </div>
                <div className="text-2xl font-black text-emerald-500">0<span className="text-slate-700 text-lg">/6 docs</span></div>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6 relative z-10">
                {[
                  { type: "Balance Sheet", format: "PDF/XLS", icon: <FileText className="w-5 h-5 text-emerald-400" /> },
                  { type: "GST Returns", format: "PDF", icon: <FileText className="w-5 h-5 text-teal-400" /> },
                  { type: "Bank Statements", format: "PDF/CSV", icon: <FileText className="w-5 h-5 text-cyan-400" /> },
                  { type: "ITR Filing", format: "PDF", icon: <FileText className="w-5 h-5 text-emerald-400" /> },
                  { type: "MOA / AOA", format: "PDF", icon: <FileText className="w-5 h-5 text-emerald-400" /> },
                  { type: "CIN / PAN", format: "PDF/JPG", icon: <FileText className="w-5 h-5 text-teal-400" /> },
                ].map((doc, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 p-4 lg:p-6 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer group/card">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/card:bg-emerald-500/10 transition-colors shrink-0">
                        {doc.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm tracking-tight truncate">{doc.type}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">{doc.format}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-2 border-dashed border-white/5 rounded-2xl lg:rounded-3xl p-8 lg:p-12 text-center space-y-3 hover:border-emerald-500/20 transition-all cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Drag & drop documents or click to browse</h3>
                  <p className="text-slate-500 text-xs mt-1">PDF, XLS, CSV, JPG supported • Max 50MB per file</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 py-3 border-t border-white/5 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <Zap className="w-4 h-4 text-emerald-500" /> Upload 3 more documents to begin
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-4 space-y-8 lg:space-y-10">
            <div className="bg-[#080e26]/60 border border-white/5 rounded-[2rem] p-6 lg:p-8 space-y-6">
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Risk Signals
                </h3>
              </header>

              <div className="space-y-6">
                {[
                  { title: "Revenue CAGR trending above sector median", time: "2m ago", variant: "success" },
                  { title: "News sentiment shift in technology sector", time: "15m ago", variant: "warning" },
                  { title: "GST compliance streak: 11/12 months", time: "1h ago", variant: "success" },
                  { title: "CIBIL Rank 2 — top decile performer", time: "1h ago", variant: "info" },
                  { title: "Interest rate environment: Monitor DSCR headroom", time: "3h ago", variant: "warning" },
                ].map((signal, i) => (
                  <div key={i} className="flex gap-4 group/sig">
                    <div className="mt-1 shrink-0">
                      {signal.variant === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                        signal.variant === "warning" ? <AlertCircle className="w-4 h-4 text-amber-500" /> :
                        <ShieldCheck className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="flex-1 border-b border-white/[0.03] pb-5">
                      <p className="text-sm text-slate-300 font-medium leading-snug group-hover/sig:text-white transition-colors">{signal.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black mt-2 tracking-widest">{signal.time}</p>
                    </div>
                    <div className={[
                      "w-2 h-2 rounded-full mt-2 shrink-0",
                      signal.variant === "success" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                      signal.variant === "warning" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                      "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    ].join(" ")} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
                                                                    