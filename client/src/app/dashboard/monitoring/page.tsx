"use client";

import { useState, useCallback } from "react";
import { Card, Badge, cn } from "@/components/shared/UI";
import {
  Activity,
  Cpu,
  Database,
  Zap,
  CheckCircle2,
  RefreshCcw,
  Loader2,
} from "lucide-react";

function randomLatency() {
  return (Math.random() * 3 + 0.2).toFixed(1) + "s";
}
function randomLoad() {
  const r = Math.random();
  return r > 0.7 ? "high" : r > 0.3 ? "medium" : "low";
}
function randomStatus() {
  return Math.random() > 0.15 ? "Active" : "Maintenance";
}
function randomMem() {
  return Math.floor(Math.random() * 40 + 25);
}
function randomApi() {
  return Math.floor(Math.random() * 3000 + 500);
}
function randomPool() {
  return Math.floor(Math.random() * 15 + 5);
}

const AGENT_NAMES = [
  { name: "Bank Statement Parser", icon: Database },
  { name: "Balance Sheet Agent", icon: Cpu },
  { name: "Risk Multiplier Engine", icon: Zap },
  { name: "Appraisal Reporter", icon: Activity },
];

function generateAgents() {
  return AGENT_NAMES.map((a, i) => ({
    id: i + 1,
    name: a.name,
    icon: a.icon,
    status: randomStatus(),
    latency: randomLatency(),
    load: randomLoad(),
  }));
}

function generateLogs() {
  const actions = [
    { company: "TechNova", action: "Risk Score Recomputed", details: "Score changed dynamically" },
    { company: "Global Logistics", action: "Statement Upload", details: "File processed successfully" },
    { company: "PharmaCore", action: "Anomaly Detected", details: "Unusual outflow pattern" },
    { company: "GreenEnergy", action: "Report Generated", details: "Credit Appraisal synced" },
    { company: "MegaCorp", action: "New Entity Registered", details: "Onboarding complete" },
    { company: "InfraBuild", action: "Document Parsed", details: "Balance Sheet v2" },
  ];
  const shuffled = [...actions].sort(() => Math.random() - 0.5).slice(0, 4);
  return shuffled.map((l, i) => ({
    ...l,
    time: i === 0 ? "just now" : i === 1 ? `${Math.floor(Math.random() * 10 + 1)}m ago` : `${Math.floor(Math.random() * 5 + 1)}h ago`,
  }));
}

export default function MonitoringPage() {
  const [agents, setAgents] = useState(generateAgents());
  const [logs, setLogs] = useState(generateLogs());
  const [mem, setMem] = useState(randomMem());
  const [apiCalls, setApiCalls] = useState(randomApi());
  const [pool, setPool] = useState(randomPool());
  const [refreshing, setRefreshing] = useState(false);
  const [lastScan, setLastScan] = useState("just now");

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setAgents(generateAgents());
      setLogs(generateLogs());
      setMem(randomMem());
      setApiCalls(randomApi());
      setPool(randomPool());
      setLastScan("just now");
      setRefreshing(false);
    }, 800);
  }, []);

  return (
    <div className="p-4 lg:p-10 max-w-7xl mx-auto space-y-6 lg:space-y-10">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <Activity className="w-7 h-7 text-emerald-500" /> System <span className="text-emerald-500">Monitoring</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Agent health, execution logs, and infrastructure status.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shrink-0"
        >
          {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
          {refreshing ? "Refreshing..." : "Refresh Status"}
        </button>
      </header>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card key={agent.id} className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-emerald-600/10 rounded-lg text-emerald-500">
                  <Icon className="w-5 h-5" />
                </div>
                <Badge variant={agent.status === "Active" ? "success" : "warning"}>{agent.status}</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
                <p className="text-xs text-slate-500 mt-1">Latency: <span className="text-slate-300">{agent.latency}</span></p>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Load: {agent.load}</span>
                <div className="flex gap-1">
                  <div className={cn("w-1.5 h-1.5 rounded-full", agent.load !== "low" ? "bg-emerald-500" : "bg-emerald-500")} />
                  <div className={cn("w-1.5 h-1.5 rounded-full", agent.load === "high" || agent.load === "medium" ? "bg-emerald-500" : "bg-slate-700")} />
                  <div className={cn("w-1.5 h-1.5 rounded-full", agent.load === "high" ? "bg-rose-500" : "bg-slate-700")} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
        {/* Audit Logs */}
        <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Audit Trail & Logs
            </h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Live</span>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[500px]">
              <thead className="bg-white/5 text-slate-500 text-[10px] uppercase font-bold">
                <tr>
                  <th className="px-5 py-3">Entity</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Details</th>
                  <th className="px-5 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-medium text-white">{log.company}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{log.details}</td>
                    <td className="px-5 py-4 text-right text-slate-500 text-xs font-mono">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* System Health */}
        <Card className="flex flex-col gap-5">
          <h3 className="font-bold text-white">Resource Intelligence</h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Memory Usage</span>
                <span className="text-white font-bold">{mem}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${mem > 70 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${mem}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Gemini API Calls</span>
                <span className="text-white font-bold">{apiCalls.toLocaleString()} / 5k</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${(apiCalls / 5000) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">DB Connection Pool</span>
                <span className="text-white font-bold">Active ({pool})</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${(pool / 20) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-5 border-t border-white/5">
            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" /> All Systems Nominal
              </div>
              <p className="text-[10px] text-slate-500">Last health scan: {lastScan}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
