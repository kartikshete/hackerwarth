"use client";

import { CheckCircle2, Cpu, Database, Gavel, Brain, Sparkles } from "lucide-react";

const AGENTS = [
  { name: "Data Extraction", status: "DONE", desc: "Document parsing complete", icon: Database, color: "emerald" },
  { name: "Financial Analysis", status: "DONE", desc: "Ratio computation done", icon: Cpu, color: "purple" },
  { name: "Legal Intelligence", status: "DONE", desc: "Registry verified", icon: Gavel, color: "cyan" },
  { name: "Behavioral Risk", status: "DONE", desc: "Pattern analysis done", icon: Brain, color: "amber" },
  { name: "Report Synthesis", status: "DONE", desc: "Report ready", icon: Sparkles, color: "emerald" },
];

const COLOR_MAP: Record<string, { icon: string; bar: string; glow: string }> = {
  emerald: { icon: "text-emerald-500", bar: "from-emerald-600 to-emerald-400", glow: "shadow-[0_0_10px_rgba(16,185,129,0.6)]" },
  purple: { icon: "text-purple-500", bar: "from-purple-600 to-purple-400", glow: "shadow-[0_0_10px_rgba(168,85,247,0.6)]" },
  cyan: { icon: "text-cyan-500", bar: "from-cyan-600 to-cyan-400", glow: "shadow-[0_0_10px_rgba(6,182,212,0.6)]" },
  amber: { icon: "text-amber-500", bar: "from-amber-600 to-amber-400", glow: "shadow-[0_0_10px_rgba(245,158,11,0.6)]" },
};

export default function AgentNetwork() {
  return (
    <div className="bg-[#080e26]/40 border border-white/5 rounded-2xl lg:rounded-[2.5rem] p-5 lg:p-10 space-y-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />

      <header className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3 text-xs text-emerald-400 font-black uppercase tracking-widest">
          <Cpu className="w-5 h-5" /> Agent Network
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] text-slate-400 uppercase tracking-widest">
          5 Agents
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 relative z-10">
        {AGENTS.map((agent, i) => {
          const c = COLOR_MAP[agent.color];
          return (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl p-4 space-y-3 transition-all group cursor-default"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${c.icon}`}>
                  <agent.icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-white tracking-tight">{agent.name}</h4>
              </div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> {agent.desc}
              </p>
              <div className="relative h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${c.bar} ${c.glow} rounded-full`} style={{ width: "100%" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
