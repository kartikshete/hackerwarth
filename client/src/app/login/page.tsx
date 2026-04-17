"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple client-side auth (no backend needed)
    if (email && password.length >= 4) {
      localStorage.setItem("aether_user", JSON.stringify({ email, loggedIn: true, ts: Date.now() }));
      router.push("/dashboard");
    } else {
      setError("Please enter a valid email and password (min 4 chars).");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040610] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] -z-10" />
      <div className="fixed inset-0 overflow-hidden -z-20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-600/8 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">AETHER</h1>
            <p className="text-emerald-500 text-[11px] tracking-[0.4em] font-bold uppercase">Credit Intelligence</p>
          </div>
          <p className="text-slate-500 text-sm">Sign in to access your AI-powered credit analysis dashboard.</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#080e26]/80 border border-white/5 rounded-3xl p-8 space-y-6 shadow-[0_0_80px_rgba(16,185,129,0.05)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-3xl" />

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 block">Email Address</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-sm text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-emerald-500/30" />
                Remember me
              </label>
              <button type="button" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.2)] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Sign In</>}
            </button>
          </form>

          <div className="text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">
              Protected by <span className="text-emerald-500 font-bold">AETHER</span> Security Protocol
            </p>
          </div>
        </div>

        {/* Footer badges */}
        <div className="flex justify-center gap-6 text-[9px] text-slate-600 uppercase tracking-widest font-bold">
          <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500" /> RBI Compliant</span>
          <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500" /> SOC 2</span>
          <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500" /> 256-bit SSL</span>
        </div>
      </div>
    </div>
  );
}
