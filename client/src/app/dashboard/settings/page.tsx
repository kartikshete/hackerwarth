"use client";

import { useState } from "react";
import { Settings, ShieldCheck, Bell, Globe, Database, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    companyName: "AETHER Credit Intelligence",
    email: "admin@aethercredit.ai",
    aiModel: "gemini-2.5-flash",
    riskThreshold: "750",
    autoReport: true,
    emailAlerts: true,
    slackAlerts: false,
    darkMode: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 lg:p-10 max-w-4xl mx-auto space-y-6 lg:space-y-8">
      <header>
        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tighter flex items-center gap-3">
          <Settings className="w-7 h-7 text-emerald-500" /> System Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Configure platform, AI engine, and notification preferences.</p>
      </header>

      {/* General */}
      <div className="bg-[#080e26]/60 border border-white/5 rounded-2xl p-6 space-y-5">
        <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <Globe className="w-4 h-4" /> General
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Platform Name</label>
            <input
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Admin Email</label>
            <input
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* AI Engine */}
      <div className="bg-[#080e26]/60 border border-white/5 rounded-2xl p-6 space-y-5">
        <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> AI Engine Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">AI Model</label>
            <select
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all appearance-none"
              value={settings.aiModel}
              onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Accurate)</option>
              <option value="gpt-4o">GPT-4o</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Risk Score Threshold</label>
            <input
              type="number"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all"
              value={settings.riskThreshold}
              onChange={(e) => setSettings({ ...settings, riskThreshold: e.target.value })}
            />
            <p className="text-[9px] text-slate-600 mt-1">Scores below this trigger manual review</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl p-4">
          <div>
            <p className="text-sm text-white font-bold">Auto-Generate Reports</p>
            <p className="text-[10px] text-slate-500">Automatically create credit appraisal after scoring</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, autoReport: !settings.autoReport })}
            className={`w-12 h-7 rounded-full transition-all relative ${settings.autoReport ? "bg-emerald-500" : "bg-slate-700"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${settings.autoReport ? "left-6" : "left-1"}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#080e26]/60 border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <Bell className="w-4 h-4" /> Notifications
        </h2>
        {[
          { key: "emailAlerts", label: "Email Alerts", desc: "Get notified on critical risk changes" },
          { key: "slackAlerts", label: "Slack Integration", desc: "Push alerts to Slack channel" },
          { key: "darkMode", label: "Dark Mode", desc: "System-wide dark theme" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <div>
              <p className="text-sm text-white font-bold">{item.label}</p>
              <p className="text-[10px] text-slate-500">{item.desc}</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, [item.key]: !(settings as any)[item.key] })}
              className={`w-12 h-7 rounded-full transition-all relative ${(settings as any)[item.key] ? "bg-emerald-500" : "bg-slate-700"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${(settings as any)[item.key] ? "left-6" : "left-1"}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
          saved
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
        }`}
      >
        {saved ? <><Check className="w-4 h-4" /> Saved Successfully</> : <><Save className="w-4 h-4" /> Save Changes</>}
      </button>
    </div>
  );
}
