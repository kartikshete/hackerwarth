"use client";

import { LayoutDashboard, Brain, PieChart, Bell, Activity, Settings, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/components/shared/UI";

const NAV_ITEMS = [
  { label: "AI Intelligence", icon: Brain, href: "/dashboard" },
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/overview" },
  { label: "Portfolio", icon: PieChart, href: "/dashboard/portfolio" },
  { label: "Alerts", icon: Bell, href: "/dashboard/alerts" },
  { label: "Monitoring", icon: Activity, href: "/dashboard/monitoring" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("aether_user");
    router.push("/login");
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex w-72 bg-[#040610] border-r border-white/5 flex-col sticky top-0 h-screen z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tighter">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white text-lg font-black tracking-tight">AETHER</span>
              <span className="text-emerald-500 text-[10px] tracking-[0.3em] font-normal">CREDIT</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group relative overflow-hidden",
                pathname === item.href ? "bg-emerald-500/10 text-emerald-400" : "text-slate-500 hover:text-white hover:bg-white/5"
              )}
            >
              {pathname === item.href && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-emerald-500 rounded-r-full" />
              )}
              <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-emerald-500" : "group-hover:text-white transition-colors")} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-6">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center border border-white/10">
              <span className="font-black text-white">KS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Kartik Shete</p>
              <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest truncate">Senior Analyst</p>
            </div>
          </div>

          <div className="px-4 py-3 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">System Health</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Operational</span>
              <span className="text-[8px] font-mono text-slate-600">99.9% UP</span>
            </div>
          </div>

          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2 w-full rounded-xl text-slate-500 hover:text-rose-400 transition-all group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-tight">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#040610]/95 backdrop-blur-md border-t border-white/10 flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all",
              pathname === item.href ? "text-emerald-400" : "text-slate-600"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
