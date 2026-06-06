import { useState, useEffect } from 'react';

interface IntroSequenceProps {
  onComplete: () => void;
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [phase, setPhase] = useState<'loading' | 'video'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = performance.now();
    const duration = 2500;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => setPhase('video'), 300); // Slight pause at 100% before transition
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] max-w-[100vw] overflow-hidden bg-[#050505] text-white font-body">
      {/* Scan Lines Overlay for authentic aesthetic */}
      <div className="fixed inset-0 scan-lines z-[60] mix-blend-overlay pointer-events-none"></div>
      
      {/* Phase 1: Loading Screen */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${
          phase === 'loading' ? 'opacity-100 z-50' : 'opacity-0 z-0 pointer-events-none'
        }`}
      >
        <h1 className="font-display text-4xl md:text-6xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-8 tracking-widest uppercase text-center max-w-4xl mx-auto px-4">
          Welcome to<br/>
          <span className="text-brand-red">LA CASA DE IPE</span>
        </h1>
        
        <div className="w-64 md:w-80 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-brand-red shadow-[0_0_10px_rgba(139,0,0,0.8)] transition-none"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="font-mono text-xs text-gray-500 mt-5 opacity-70 animate-pulse uppercase tracking-[0.2em] drop-shadow-md">
          Decrypting Mission Data... {Math.floor(progress)}%
        </p>
      </div>

      {/* Phase 2: Cinematic Video Placeholder */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          phase === 'video' ? 'opacity-100 z-40' : 'opacity-0 z-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black"></div>
        {phase === 'video' && (
          <video 
            autoPlay 
            muted 
            playsInline
            onEnded={onComplete}
            className="w-full h-full object-cover opacity-80"
          >
            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
          </video>
        )}
        
        {/* Soft gradient overlay so text remains readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="absolute top-8 right-8 z-[100]">
          <button 
            onClick={onComplete}
            className="flex items-center gap-2 px-5 py-2.5 bg-black/40 backdrop-blur border border-brand-gold text-brand-gold font-display uppercase tracking-widest text-sm md:text-base hover:bg-brand-gold hover:text-black transition-all duration-300 glow-gold active:scale-95 shadow-xl"
          >
            Skip Intro
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="m13 17 5-5-5-5M6 17l5-5-5-5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
