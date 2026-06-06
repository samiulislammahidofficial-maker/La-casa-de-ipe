import { Users, Target, Shield, Zap } from "lucide-react";

export default function AboutUsView({ onViewChange }: { onViewChange: (view: any) => void }) {
  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 bg-black/50 text-white font-mono flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <h1 className="font-display text-4xl md:text-5xl text-brand-gold-bright uppercase tracking-widest mb-8 text-center drop-shadow-lg">
          About The Masterminds
        </h1>
        
        <div className="bg-[#111]/80 backdrop-blur-xl border border-brand-red/30 p-8 rounded-xl shadow-[0_0_30px_rgba(139,0,0,0.2)] mb-12">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
            This operation is driven by the collaborative efforts of the <strong className="text-brand-red">Yeamizing</strong> and <strong className="text-brand-gold-bright">Money Mavericks</strong> teams.
          </p>
          <p className="text-md text-gray-400 leading-relaxed mb-8">
            Focusing on innovation, strategic competition, and flawless execution, these teams have engineered an unparalleled heist-themed reception that challenges intellect and celebrates tactical superiority.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="flex items-start gap-4 p-4 border border-white/5 bg-white/5 rounded-lg hover:border-brand-red/50 transition-all">
              <Zap className="text-brand-red shrink-0" size={28} />
              <div>
                <h3 className="font-display text-xl text-white uppercase mb-2">Innovation</h3>
                <p className="text-sm text-gray-400">Pushing the boundaries of what a collegiate event can be, blending digital strategy with physical challenges.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-white/5 bg-white/5 rounded-lg hover:border-brand-gold-bright/50 transition-all">
              <Target className="text-brand-gold-bright shrink-0" size={28} />
              <div>
                <h3 className="font-display text-xl text-white uppercase mb-2">Strategic Competition</h3>
                <p className="text-sm text-gray-400">Every operation is designed to test critical thinking, leadership, and adaptive problem-solving skills.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-12">
          <button
            onClick={() => onViewChange("hub")}
            className="px-8 py-3 border border-white/20 text-white hover:bg-white/10 font-mono text-sm uppercase tracking-widest transition-all rounded-lg"
          >
            Return to Base
          </button>
        </div>
      </div>
    </div>
  );
}
