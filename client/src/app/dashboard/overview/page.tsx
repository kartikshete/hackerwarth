"use client";

import { Card, Badge } from "@/components/shared/UI";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend
} from "recharts";
import { TrendingUp, AlertCircle, ShieldCheck, Users } from "lucide-react";

const BUCKET_DATA = [
  { name: "Low Risk", value: 45, color: "#10b981" },
  { name: "Medium Risk", value: 30, color: "#3b82f6" },
  { name: "High Risk", value: 15, color: "#f59e0b" },
  { name: "Very High", value: 10, color: "#ef4444" },
];

const SECTOR_DATA = [
  { name: "Tech", count: 40 },
  { name: "Mfg", count: 35 },
  { name: "Retail", count: 25 },
  { name: "Energy", count: 15 },
  { name: "Logistics", count: 10 },
];

export default function PortfolioOverview() {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Portfolio Analytics</h1>
        <p className="text-slate-400">Aggregated credit intelligence and risk distribution.</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <Users className="w-5 h-5 text-emerald-500" />
                <Badge variant="success">+12%</Badge>
            </div>
            <p className="text-2xl font-bold text-white">1,248</p>
            <p className="text-xs text-slate-500">Total Portfolios</p>
        </Card>
        <Card className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <ShieldCheck className="w-5 h-5 text-teal-500" />
                <Badge variant="info">Stable</Badge>
            </div>
            <p className="text-2xl font-bold text-white">742</p>
            <p className="text-xs text-slate-500">Avg. Risk Score</p>
        </Card>
        <Card className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <Badge variant="warning">Monitor</Badge>
            </div>
            <p className="text-2xl font-bold text-white">$42.8M</p>
            <p className="text-xs text-slate-500">Total Exposure</p>
        </Card>
        <Card className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <Badge variant="danger">Critical</Badge>
            </div>
            <p className="text-2xl font-bold text-white">24</p>
            <p className="text-xs text-slate-500">Defaulter Alerts</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution Chart */}
        <Card className="h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Risk Bucket Distribution</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={BUCKET_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {BUCKET_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141417', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sector Exposure Chart */}
        <Card className="h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Exposure by Sector</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SECTOR_DATA}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#141417', borderColor: '#27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Alerts Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-white/5">
            <h3 className="font-bold text-white">High Stress Companies</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="bg-white/5 text-slate-500 text-xs font-semibold">
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">Anomaly Flag</th>
                        <th className="px-6 py-4">Score Drop</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">Zetta Manufacturing</td>
                        <td className="px-6 py-4"><Badge variant="danger">Cash Flow Stress</Badge></td>
                        <td className="px-6 py-4 text-rose-400 font-mono">-142 pts</td>
                        <td className="px-6 py-4"><button className="text-emerald-400 hover:underline">Auditing...</button></td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">Oceanic Pharma</td>
                        <td className="px-6 py-4"><Badge variant="warning">Payment Delays</Badge></td>
                        <td className="px-6 py-4 text-amber-400 font-mono">-58 pts</td>
                        <td className="px-6 py-4"><button className="text-emerald-400 hover:underline">Details</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
}
