import { CheckCircle, PartyPopper, Ticket } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface RegistrationSuccessProps {
  onViewChange: (view: string) => void;
}

export default function RegistrationSuccess({ onViewChange }: RegistrationSuccessProps) {
  const { userData } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Celebratory ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-green-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="bg-[#111]/90 backdrop-blur-xl border border-green-500/20 rounded-2xl p-10 shadow-[0_0_60px_rgba(34,197,94,0.1)]">
          {/* Success icon */}
          <div className="w-24 h-24 mx-auto bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mb-8 relative">
            <CheckCircle size={48} className="text-green-500" />
            <div className="absolute -top-2 -right-2 animate-bounce">
              <PartyPopper size={24} className="text-brand-gold-bright" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wider text-white mb-3">
            Registration<br />Complete!
          </h1>
          <p className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-8">
            Welcome to the operation, {userData?.name || "Operative"}
          </p>

          {/* Details card */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between">
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Name</span>
              <span className="font-mono text-sm text-white">{userData?.name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Student ID</span>
              <span className="font-mono text-sm text-white">{userData?.studentId || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Department</span>
              <span className="font-mono text-sm text-brand-gold-bright">{userData?.department || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Status</span>
              <span className="font-mono text-sm text-green-400 flex items-center gap-1.5">
                <CheckCircle size={12} /> Active
              </span>
            </div>
          </div>

          {/* Auto-registered event badge */}
          <div className="bg-brand-gold-bright/5 border border-brand-gold-bright/20 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Ticket size={20} className="text-brand-gold-bright shrink-0" />
            <div className="text-left">
              <p className="font-mono text-[10px] text-brand-gold-bright uppercase tracking-widest">
                Auto-registered
              </p>
              <p className="font-display text-lg text-white uppercase tracking-wider">
                The Bizz Seminar
              </p>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => onViewChange("hub")}
            className="w-full py-4 bg-brand-red hover:bg-red-800 text-white font-display text-lg uppercase tracking-widest transition-all duration-300 rounded-xl shadow-[0_0_30px_rgba(139,0,0,0.3)] border border-red-900"
          >
            Enter the Portal
          </button>
        </div>
      </div>
    </div>
  );
}
