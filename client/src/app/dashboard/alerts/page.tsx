"use client";

import { useEffect, useState } from "react";
import { Card, Badge, cn } from "@/components/shared/UI";
import { 
  AlertCircle,
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  Search,
  Filter,
  Bell
} from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, if DB is empty, we show mock alerts to demonstrate the UI
    fetch("/api/alerts")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setAlerts(data);
        else setAlerts(MOCK_ALERTS);
      })
      .catch(() => setAlerts(MOCK_ALERTS))
      .finally(() => setIsLoading(false));
  }, []);

  const MOCK_ALERTS = [
    {
      id: "1",
      company: { name: "Zetta Manufacturing", sector: "Manufacturing" },
      type: "Risk Score Drop",
      severity: "Critical",
      description: "Company score dropped by 142 points following new bank statement parsing.",
      createdAt: "10 mins ago",
      resolved: false
    },
    {
      id: "2",
      company: { name: "Oceanic Pharma", sector: "Healthcare" },
      type: "Cash Flow Stress",
      severity: "Warning",
      description: "Negative operating cash flow detected for 2 consecutive months.",
      createdAt: "3 hours ago",
      resolved: false
    },
    {
      id: "3",
      company: { name: "Global Logistics", sector: "Transport" },
      type: "Payment Delay",
      severity: "High",
      description: "Significant increase in bounce rates detected in latest transaction logs.",
      createdAt: "1 day ago",
      resolved: false
    }
  ];

  const getSeverityVariant = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "danger";
      case "high": return "danger";
      case "warning": return "warning";
      default: return "info";
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-rose-500" /> Active System <span className="text-emerald-500">Alerts</span>
          </h1>
          <p className="text-slate-400 mt-2">Real-time risk notifications and anomaly triggers.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-lg text-sm border border-white/10 transition-all flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                Mark All Read
            </button>
        </div>
      </header>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input 
            type="text" 
            placeholder="Search alerts by company or type..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-xl"
        />
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="p-0 overflow-hidden group">
            <div className="p-6 flex items-start gap-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                alert.severity === "Critical" ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : 
                alert.severity === "Warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : 
                "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              )}>
                {alert.severity === "Critical" ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-white">{alert.company.name}</h3>
                    <Badge variant={getSeverityVariant(alert.severity) as any}>{alert.severity}</Badge>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">| {alert.type}</span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {alert.createdAt}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{alert.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1">
                  Resolve
                </button>
                <button className="p-2 bg-emerald-600/10 hover:bg-emerald-600 rounded-lg text-emerald-400 hover:text-white transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
