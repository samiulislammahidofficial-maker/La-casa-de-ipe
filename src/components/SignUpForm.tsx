import { useState } from "react";
import { useMockState } from "../context/MockStateContext";

export default function SignUpForm({ onComplete }: { onComplete: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useMockState();
  const [loading, setLoading] = useState(false);

  const handleMockAction = () => {
    setLoading(true);
    setTimeout(() => {
      login();
      setLoading(false);
      onComplete();
    }, 800); // simulate network request
  };

  return (
    <div className="w-full mx-auto p-6 bg-[#1a1a1a] border border-brand-red/50 rounded-lg shadow-[0_0_20px_rgba(139,0,0,0.3)] text-white font-body">
      <h2 className="text-3xl font-display text-center uppercase mb-6 tracking-widest text-brand-gold-bright">
        {isLogin ? "Operative Login" : "Join the Heist"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            defaultValue="alpha@example.com"
            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 focus:border-brand-red focus:outline-none"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
            Password
          </label>
          <input
            type="password"
            defaultValue="password123"
            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 focus:border-brand-red focus:outline-none"
            autoComplete="current-password"
          />
        </div>

        <button
          onClick={handleMockAction}
          disabled={loading}
          className="w-full mt-6 py-3 bg-brand-red text-white font-display uppercase tracking-wider rounded border border-red-800 hover:bg-red-800 transition-colors disabled:opacity-50 glow-red"
        >
          {loading ? "Decrypting..." : (isLogin ? "Enter Terminal" : "Register as Operative")}
        </button>

        <p className="text-center text-sm mt-4 text-gray-400">
          {isLogin ? "Need an access code? " : "Already an operative? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-red hover:text-white transition-colors underline underline-offset-4"
          >
            {isLogin ? "Register Now" : "Login"}
          </button>
        </p>

      </div>
    </div>
  );
}
