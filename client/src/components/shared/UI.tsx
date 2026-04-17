import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("glass-card rounded-xl p-6 transition-all hover:border-white/20", className)}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "danger" | "info" }) {
  const variants = {
    default: "bg-slate-800 text-slate-400",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]",
    warning: "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_10px_rgba(155,91,255,0.1)]",
    danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]",
    info: "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em]", variants[variant])}>
      {children}
    </span>
  );
}
