"use client";

import { useState } from "react";
import { Card, cn } from "@/components/shared/UI";
import { X, Plus, Building2, Briefcase, TrendingUp, Calendar, AlertCircle, Loader2 } from "lucide-react";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCompanyModal({ isOpen, onClose }: AddCompanyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    businessAge: "",
    turnover: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            // Clean turnover string before sending
            turnover: formData.turnover.replace(/[^0-9.]/g, '')
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Server connection failed");
      }

      onClose();
      window.location.reload();
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(`Failed to register: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#040610]/90 backdrop-blur-md" onClick={onClose} />
      
      <Card className="relative w-full max-w-lg bg-[#080e26]/80 border-emerald-500/20 shadow-[0_0_50px_rgba(79,121,255,0.1)] p-0 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-teal-500" />
        
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-500" /> Register Corporate Entity
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 block">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="e.g. Meridian Industries"
                  className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500 transition-all outline-none text-white shadow-inner"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 block">Sector</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select 
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500 transition-all outline-none appearance-none text-white"
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                    required
                  >
                    <option value="">Select Sector</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Technology">Technology</option>
                    <option value="Energy">Energy</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Pharma">Pharma</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 block">Business Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="number" 
                    placeholder="Years"
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500 transition-all outline-none text-white"
                    value={formData.businessAge}
                    onChange={(e) => setFormData({...formData, businessAge: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 block">Estimated Annual Turnover (₹ Cr)</label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="e.g. 150.5"
                  className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500 transition-all outline-none text-white"
                  value={formData.turnover}
                  onChange={(e) => setFormData({...formData, turnover: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
             <button 
               type="submit" 
               disabled={isSubmitting}
               className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3.5 rounded-lg font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,121,255,0.3)] disabled:opacity-50"
             >
               {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initialize Intelligence Registry"}
             </button>
             <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
               <AlertCircle className="w-3 h-3" /> System triggers an automated multi-agent risk audit protocol on registration.
             </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
