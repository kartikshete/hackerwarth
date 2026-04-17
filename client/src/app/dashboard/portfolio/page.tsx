"use client";

import { useEffect, useState } from "react";
import { PieChart, TrendingUp, TrendingDown, Building2, AlertTriangle, Loader2, RefreshCcw } from "lucide-react";

interface CompanyData {
  id: string;
  name: string;
  sector: string;
  status: string;
  riskScore: number;
  riskBucket: string;
}

const BUCKET_COLORS: Record<string, string> = {
  LOW: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  MEDIUM: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  HIGH: "text-red-400 bg-red-500/10 border-red-500/20",
  VERY_HIGH: "text-red-500 bg-red-500/20 border-red-500/30",
  Unknown: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

export default function PortfolioPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/companies");
      if (res.ok) setCompanies(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalEntities = companies.length;
  const avgScore = totalEntities > 0 ? Math.round(companies.reduce((s, c) => s + c.riskScore, 0) / totalEntities) : 0;
  const lowRisk = companies.filter((c) => c.riskBucket === "LOW").length;
  const highRisk = companies.filter((c) => c.riskBucket === "HIGH" || c.riskBucket === "VERY_HIGH").length;

  const sectorMap: Record<string, number> = {};
  companies.forEach((c) => { sectorMap[c.sector] = (sectorMap[c.sector] || 0) + 1; });

  return (
    <div className="p-4 lg:p-10 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <PieChart className="w-7 h-7 text-emerald-500" /> Portfolio Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">Aggregate risk intelligence across all monitored entities.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-all shrink-0">
          <RefreshCcw className="w-4 h-4" /> Refresh
        </button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
            {[
              { label: "Total Entities", value: totalEntities, icon: <Building2 className="w-5 h-5" />, color: "text-white" },
              { label: "Avg Risk Score", value: avgScore, icon: <TrendingUp className="w-5 h-5" />, color: avgScore > 500 ? "text-emerald-400" : "text-amber-400" },
              { label: "Low Risk", value: lowRisk, icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-400" },
              { label: "High Risk", value: highRisk, icon: <AlertTriangle className="w-5 h-5" />, color: "text-red-400" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#080e26]/60 border border-white/5 rounded-2xl p-5 space-y-3 hover:border-white/10 transition-all">
                <div className={`p-2 w-fit rounded-lg bg-white/5 ${stat.color}`}>{stat.icon}</div>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Sector Breakdown + Company List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Sectors */}
            <div className="bg-[#080e26]/60 border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest">Sector Distribution</h3>
              {Object.entries(sectorMap).length === 0 ? (
                <p className="text-slate-500 text-sm">No data yet. Add companies to see sector breakdown.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(sectorMap).map(([sector, count]) => (
                    <div key={sector} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-bold">{sector}</span>
                        <span className="text-white font-black">{count}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${(count / totalEntities) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Company Cards */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest">Entity Risk Map</h3>
              {companies.length === 0 ? (
                <div className="bg-[#080e26]/60 border border-white/5 rounded-2xl p-10 text-center">
                  <p className="text-slate-500">No companies registered yet. Go to the dashboard to add one.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {companies.map((c) => (
                    <div key={c.id} className="bg-[#080e26]/60 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-black text-white">{c.name}</h4>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">{c.sector}</p>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${BUCKET_COLORS[c.riskBucket] || BUCKET_COLORS.Unknown}`}>
                          {c.riskBucket}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${c.riskScore > 700 ? "bg-emerald-500" : c.riskScore > 400 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${Math.min((c.riskScore / 1000) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-white">{c.riskScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
