import React, { useState } from "react";
import { Shield, KeyRound, User, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AdminLoginProps {
  onViewChange: (view: string) => void;
}

// Hardcoded admin credentials
const ADMIN_ID = "2408093";
const ADMIN_PASS = "mahid_vai_shera";

export default function AdminLogin({ onViewChange }: AdminLoginProps) {
  const { setAdminSession } = useAuth();
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 800));

    if (adminId.trim() === ADMIN_ID && adminPass === ADMIN_PASS) {
      setAdminSession(true);
      onViewChange("adminDashboard");
    } else {
      setError("Invalid admin credentials. Access denied.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Danger-zone ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/3 rounded-full blur-[150px]"></div>
      </div>

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]"></div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-brand-red/10 border-2 border-brand-red/40 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(139,0,0,0.3)]">
            <Shield size={28} className="text-brand-red" />
          </div>
          <h1 className="font-display text-3xl uppercase tracking-widest text-brand-red glow-red-text">
            Admin Access
          </h1>
          <p className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.3em] mt-2">
            Restricted Zone — Authorized Personnel Only
          </p>
        </div>

        {/* Login card */}
        <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-brand-red/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(139,0,0,0.15)]">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
                Admin ID
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="Enter Admin ID"
                  value={adminId}
                  onChange={(e) => {
                    setAdminId(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-black/60 border border-brand-red/15 focus:border-brand-red/50 focus:shadow-[0_0_20px_rgba(139,0,0,0.15)] outline-none rounded-lg pl-11 pr-4 py-3.5 text-white font-mono text-sm transition-all placeholder:text-gray-700"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
                Admin Password
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="password"
                  placeholder="Enter Admin Password"
                  value={adminPass}
                  onChange={(e) => {
                    setAdminPass(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-black/60 border border-brand-red/15 focus:border-brand-red/50 focus:shadow-[0_0_20px_rgba(139,0,0,0.15)] outline-none rounded-lg pl-11 pr-4 py-3.5 text-white font-mono text-sm transition-all placeholder:text-gray-700"
                  autoComplete="off"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <p className="font-mono text-xs text-red-300 leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-red hover:bg-red-800 text-white font-display text-lg uppercase tracking-widest transition-all duration-300 rounded-xl shadow-[0_0_30px_rgba(139,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-red-900"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Access Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onViewChange("hub")}
            className="font-mono text-xs text-gray-700 hover:text-gray-500 uppercase tracking-widest transition-colors"
          >
            ← Return to Base
          </button>
        </div>
      </div>
    </div>
  );
}
