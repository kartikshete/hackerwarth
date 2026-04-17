"use client";

import { useRef, useState } from "react";
import { cn } from "@/components/shared/UI";
import {
  X,
  FileUp,
  FileCheck,
  AlertCircle,
  Loader2,
  Receipt,
  Table,
  ShieldCheck,
  Briefcase,
  Database,
  Zap,
} from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  companyId: string;
}

type FileCategory = "bank" | "balance" | "legal" | "credit";

const FILE_TYPE_MAP: Record<FileCategory, string> = {
  bank: "BANK_STATEMENT",
  balance: "BALANCE_SHEET",
  legal: "GST_ROC",
  credit: "CREDIT_BUREAU",
};

export default function UploadModal({ isOpen, onClose, companyName, companyId }: UploadModalProps) {
  const [uploads, setUploads] = useState<
    Record<FileCategory, { status: "idle" | "uploading" | "success" | "failed"; name?: string; error?: string }>
  >({
    bank: { status: "idle" },
    balance: { status: "idle" },
    legal: { status: "idle" },
    credit: { status: "idle" },
  });

  const [dragActive, setDragActive] = useState<FileCategory | null>(null);

  // One hidden <input> ref per category
  const inputRefs = useRef<Record<FileCategory, HTMLInputElement | null>>({
    bank: null,
    balance: null,
    legal: null,
    credit: null,
  });

  if (!isOpen) return null;

  const handleFileChange = async (category: FileCategory, file: File) => {
    setUploads((prev) => ({ ...prev, [category]: { status: "uploading", name: file.name } }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", FILE_TYPE_MAP[category]);

      // Step 1: Upload the real file to the server
      const uploadRes = await fetch(`/api/companies/${companyId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err?.error || "Upload failed");
      }

      const { fileId } = await uploadRes.json();

      // Step 2: Trigger the Data Collection Agent to kick off processing
      const agentRes = await fetch("/api/agents/data-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          file_type: FILE_TYPE_MAP[category],
          file_url: `/uploads/${companyId}/${file.name}`,
          fileId,
        }),
      });

      if (!agentRes.ok) throw new Error("Agent pipeline failed to start");

      setUploads((prev) => ({
        ...prev,
        [category]: { status: "success", name: file.name },
      }));
    } catch (err: any) {
      setUploads((prev) => ({
        ...prev,
        [category]: { status: "failed", error: err.message },
      }));
    }
  };

  const sections = [
    { id: "bank" as const, label: "Bank Statement", icon: <Receipt className="w-5 h-5" />, desc: "PDF/CSV · Last 12 months · Behavioral Agent" },
    { id: "balance" as const, label: "Balance Sheet", icon: <Table className="w-5 h-5" />, desc: "PDF (Audited) · Financial Analysis Agent" },
    { id: "legal" as const, label: "Legal/GST Registry", icon: <Briefcase className="w-5 h-5" />, desc: "MCA21 / GST Filings · Legal Intelligence" },
    { id: "credit" as const, label: "Bureau Data", icon: <ShieldCheck className="w-5 h-5" />, desc: "CIBIL / Experian snapshots · Synthesis Agent" },
  ];

  const anySuccess = Object.values(uploads).some((u) => u.status === "success");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#040610]/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#080e26]/95 border border-emerald-500/20 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.1)] overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" /> Intelligence Ingestion
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest">
              ENTITY: <span className="text-emerald-400 font-bold">{companyName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Rows */}
        <div className="p-6 space-y-3">
          {sections.map((sec) => {
            const state = uploads[sec.id];
            return (
              <div
                key={sec.id}
                onDragOver={(e) => { e.preventDefault(); setDragActive(sec.id); }}
                onDragLeave={() => setDragActive(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(null);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange(sec.id, e.dataTransfer.files[0]);
                  }
                }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                  dragActive === sec.id 
                    ? "bg-emerald-500/20 border-emerald-400 border-dashed"
                    : state.status === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : state.status === "failed"
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-black/30 border-white/5 hover:border-emerald-500/20"
                )}
                onClick={(e) => {
                  // Prevent triggering if button was explicitly clicked
                  if ((e.target as HTMLElement).closest('button')) return;
                  if (state.status === "idle" || state.status === "failed") {
                     inputRefs.current[sec.id]?.click();
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2.5 rounded-lg border",
                    state.status === "success" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : state.status === "failed" ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-slate-900 text-slate-500 border-white/5"
                  )}>
                    {sec.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{sec.label}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tight">
                      {dragActive === sec.id ? "Drop file here..." : state.status === "failed" ? (state.error || "Upload failed. Try again.") : "Drag & drop or click to upload"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept=".pdf,.csv,.xlsx,.xls"
                    className="hidden"
                    ref={(el) => { inputRefs.current[sec.id] = el; }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(sec.id, file);
                      // reset so same file can be re-selected after failure
                      e.target.value = "";
                    }}
                  />

                  {(state.status === "idle" || state.status === "failed") && (
                    <button
                      onClick={() => inputRefs.current[sec.id]?.click()}
                      className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-emerald-500/20"
                    >
                      {state.status === "failed" ? <AlertCircle className="w-4 h-4 text-red-400" /> : <FileUp className="w-4 h-4" />}
                      {state.status === "failed" ? "Retry" : "Select File"}
                    </button>
                  )}

                  {state.status === "uploading" && (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                    </div>
                  )}

                  {state.status === "success" && (
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-black">
                        <FileCheck className="w-4 h-4" /> Done
                      </div>
                      <span className="text-[9px] text-slate-500 truncate max-w-[100px] font-mono">{state.name}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 bg-emerald-500/5 border-t border-white/5 flex items-center justify-between">
          <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3 h-3 animate-bounce" /> AI agent pipeline triggers on upload
          </p>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
              Cancel
            </button>
            <button
              onClick={() => { onClose(); }}
              disabled={!anySuccess}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-30 text-white px-7 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
