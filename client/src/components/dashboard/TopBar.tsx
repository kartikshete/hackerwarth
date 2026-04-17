"use client";

import { Bell, Search, ShieldCheck } from "lucide-react";

export default function TopBar() {
  return (
    <div className="h-16 lg:h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-10 bg-black/20 backdrop-blur-sm sticky top-0 z-40 gap-4">
      
      {/* Mobile: Brand Logo (hidden on desktop) */}
      <div className="flex lg:hidden items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <span className="text-white text-sm font-black tracking-tight">AETHER</span>
      </div>

      {/* Search - full width on mobile */}
      <div className="relative group flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search entities..."
          className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-600"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Status - hidden on mobile */}
        <div className="hidden md:flex items-center gap-3 pr-6 border-r border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
          System Active
        </div>

        <button className="relative text-slate-400 hover:text-white transition-colors group shrink-0">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#040610]" />
        </button>
      </div>
    </div>
  );
}
