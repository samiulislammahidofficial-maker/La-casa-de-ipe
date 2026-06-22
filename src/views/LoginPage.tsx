import React, { useState } from "react";
import { LogIn, User, KeyRound, AlertTriangle, Loader2 } from "lucide-react";
import { signInWithStudentId, signInWithGoogle } from "../lib/firebaseUtils";

interface LoginPageProps {
  onViewChange: (view: string) => void;
  onLoginSuccess: () => void;
}

export default function LoginPage({ onViewChange, onLoginSuccess }: LoginPageProps) {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentId.trim() || !password.trim()) {
      setError("Student ID and Password are required.");
      return;
    }

    setLoading(true);
    try {
      await signInWithStudentId(studentId.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        setError("Invalid Student ID or Password. If you're new, please sign up first.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        // User closed the popup — not an error to display
      } else {
        setError(err.message || "Google sign-in failed. Please try again.");
      }
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-gold/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Branding header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tighter text-brand-red glow-red-text mb-2">
            La Casa De IPE
          </h1>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-[0.3em]">
            Secure Operative Authentication
          </p>
        </div>

        {/* Login card */}
        <div className="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <div className="p-2.5 bg-brand-red/10 border border-brand-red/30 rounded-lg">
              <LogIn size={22} className="text-brand-red" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-white uppercase tracking-wider">
                Access Portal
              </h2>
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                Authenticate to proceed
              </p>
            </div>
          </div>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 mb-6 bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/25 text-white font-mono text-sm uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
              or login with Student ID
            </span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleManualLogin} className="space-y-5">
            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">
                Student ID
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="e.g. 2408001"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-black/40 border border-white/10 focus:border-brand-red/60 focus:shadow-[0_0_20px_rgba(139,0,0,0.15)] outline-none rounded-lg pl-11 pr-4 py-3.5 text-white font-mono text-sm transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">
                Password
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-black/40 border border-white/10 focus:border-brand-red/60 focus:shadow-[0_0_20px_rgba(139,0,0,0.15)] outline-none rounded-lg pl-11 pr-4 py-3.5 text-white font-mono text-sm transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <p className="font-mono text-xs text-red-300 leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-4 bg-brand-red hover:bg-red-800 text-white font-display text-lg uppercase tracking-widest transition-all duration-300 rounded-xl shadow-[0_0_30px_rgba(139,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-red-900"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="font-mono text-xs text-gray-500">
              First time operative?{" "}
              <button
                onClick={() => onViewChange("register")}
                className="text-brand-gold-bright hover:text-yellow-400 underline underline-offset-4 transition-colors"
              >
                Sign Up Here
              </button>
            </p>
          </div>
        </div>

        {/* Back to hub */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onViewChange("hub")}
            className="font-mono text-xs text-gray-600 hover:text-gray-400 uppercase tracking-widest transition-colors"
          >
            ← Return to Base
          </button>
        </div>
      </div>
    </div>
  );
}
