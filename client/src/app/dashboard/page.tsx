"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2, Upload } from "lucide-react";
import AgentNetwork from "@/components/dashboard/AgentNetwork";
import AddCompanyModal from "@/components/dashboard/AddCompanyModal";
import UploadModal from "@/components/dashboard/UploadModal";
import AppraisalReport from "@/components/dashboard/AppraisalReport";
import { cn } from "@/components/shared/UI";

export default function DashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/companies");
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setCompanies([]);
        return;
      }
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto space-y-6 lg:space-y-10">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] -z-10" />
      
      {/* Top Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
         {/* Revenue Chart */}
         <div className="bg-[#080e26]/60 border border-white/5 rounded-2xl lg:rounded-[2.5rem] p-5 lg:p-8 space-y-4 lg:space-y-6 relative overflow-hidden group hover:border-emerald-500/10 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px]" />
            <header className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 relative z-10">
               <span>Revenue vs EBITDA (₹ Cr)</span>
               <div className="flex gap-3">
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Revenue</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-teal-500 rounded-full" /> EBITDA</span>
               </div>
            </header>
            <div className="h-36 lg:h-44 flex items-end gap-1.5 lg:gap-2 px-2 lg:px-4 relative z-10">
               {[40, 60, 45, 70, 85, 95, 80, 75, 90, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-1 items-center group/bar cursor-pointer">
                     <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md group-hover/bar:shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all duration-300 group-hover/bar:scale-x-110" style={{ height: `${h}%` }} />
                     <span className="text-[7px] lg:text-[8px] text-slate-600 font-bold">FY{20 + i}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Profit Chart */}
         <div className="bg-[#080e26]/60 border border-white/5 rounded-2xl lg:rounded-[2.5rem] p-5 lg:p-8 space-y-4 lg:space-y-6 relative overflow-hidden group hover:border-purple-500/10 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[50px]" />
            <header className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 relative z-10">
               <span>Net Profit & Debt Trend (₹ Cr)</span>
               <div className="flex gap-3">
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Net Profit</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> Debt</span>
               </div>
            </header>
            <div className="h-36 lg:h-44 flex items-end gap-1.5 lg:gap-2 px-2 lg:px-4 relative z-10">
               {[30, 40, 50, 45, 60, 75, 70, 80, 85, 90].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-1 items-center group/bar cursor-pointer">
                     <div className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md group-hover/bar:shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all duration-300 group-hover/bar:scale-x-110" style={{ height: `${h}%` }} />
                     <span className="text-[7px] lg:text-[8px] text-slate-600 font-bold">FY{20 + i}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <AgentNetwork />

      {/* Portfolio Table */}
      <div className="bg-[#080e26]/40 border border-white/5 rounded-[2rem] lg:rounded-[3rem] p-5 lg:p-10 relative overflow-hidden">
         <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 lg:mb-10 gap-4">
            <div>
               <h3 className="text-xl lg:text-3xl font-black text-white tracking-tighter">Intelligence Registry</h3>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Live Portfolio Monitoring</p>
            </div>
            <div className="flex gap-3">
               <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:border-emerald-500 outline-none transition-all w-full sm:w-48 lg:w-64" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <button 
                 onClick={() => setIsAddModalOpen(true)}
                 className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 lg:px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0"
               >
                 <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Analysis</span><span className="sm:hidden">New</span>
               </button>
            </div>
         </header>
         
         <div className="border border-white/5 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
               <thead className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <tr>
                     <th className="px-10 py-6">Entity Identity</th>
                     <th className="px-10 py-6">Intelligence Status</th>
                     <th className="px-10 py-6">Credit Score</th>
                     <th className="px-10 py-6 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center">
                         <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500 opacity-50" />
                      </td>
                    </tr>
                  ) : filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                         No entities found matching search criteria
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center font-black text-white border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                 {company.name[0]}
                              </div>
                              <div>
                                 <p className="text-white font-black text-base tracking-tight leading-none mb-1">{company.name}</p>
                                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{company.sector}</p>
                              </div>
                           </div>
                         </td>
                         <td className="px-10 py-8">
                            <span className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                company.status === "Ready" 
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  : "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse"
                            )}>
                               {company.status === "Ready" ? "Analyzed" : "Synching..."}
                            </span>
                         </td>
                         <td className="px-10 py-8">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-black text-white">{company.riskScore}/100</span>
                              <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">{company.riskBucket}</span>
                            </div>
                         </td>
                         <td className="px-10 py-8">
                            <div className="flex justify-end gap-3">
                               <button 
                                 onClick={() => { setSelectedCompany(company); setIsUploadModalOpen(true); }}
                                 className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                               >
                                  <Upload className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => { setSelectedCompany(company); setIsReportModalOpen(true); }}
                                 className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                               >
                                  Open Dossier
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
            </div>
         </div>
      </div>

      <AddCompanyModal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); fetchCompanies(); }} />
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => { setIsUploadModalOpen(false); fetchCompanies(); }} 
        companyName={selectedCompany?.name} 
        companyId={selectedCompany?.id} 
      />
      {isReportModalOpen && (
        <AppraisalReport company={selectedCompany} onClose={() => setIsReportModalOpen(false)} />
      )}
    </div>
  );
}
