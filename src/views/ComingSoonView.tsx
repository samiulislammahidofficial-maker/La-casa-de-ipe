import { Lock } from "lucide-react";

export default function ComingSoonView({ title, onViewChange }: { title: string, onViewChange: (view: any) => void }) {
  return (
    <div className="min-h-screen pt-32 pb-12 px-6 flex flex-col items-center justify-center bg-[#111] text-white font-mono relative overflow-hidden">
      
      <Lock size={64} className="text-brand-gold-bright mb-8 animate-pulse" />
      <h1 className="font-display text-4xl md:text-5xl text-white uppercase tracking-widest mb-6 text-center">
        {title}
      </h1>
      <p className="text-gray-400 max-w-lg text-center leading-relaxed mb-12 uppercase tracking-widest text-sm">
        This section of the vault is currently sealed. Operations are underway to declassify this intelligence. Check back later.
      </p>
      
      <button
        onClick={() => onViewChange("hub")}
        className="px-8 py-3 border border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-mono text-sm uppercase tracking-widest transition-all rounded-lg shadow-[0_0_15px_rgba(139,0,0,0.2)] relative z-10"
      >
        Return to Base
      </button>
    </div>
  );
}
