import { useState, useEffect } from 'react';
import heistBg from '../../picture/heist-bg.png';

interface IntroSequenceProps {
  onComplete: () => void;
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
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
        setTimeout(() => {
          onComplete();
        }, 500); // Polished brief delay at 100%
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] w-screen h-screen overflow-hidden bg-[#000000] text-white flex flex-col-reverse md:flex-row font-body">

      {/* Left Column: Text & Loader */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center p-6 text-center z-10">
        <span className="text-sm md:text-base font-mono uppercase tracking-[0.3em] text-white/80 mb-2">
          Welcome to
        </span>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-brand-red uppercase tracking-widest mb-8 text-center drop-shadow-[0_0_15px_rgba(139,0,0,0.5)]">
          LA CASA DE IPE
        </h1>

        <div className="w-64 md:w-80 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden border border-white/5 relative">
          <div
            className="absolute top-0 left-0 h-full bg-brand-red shadow-[0_0_10px_rgba(139,0,0,0.8)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="font-mono text-xs text-gray-500 mt-5 opacity-70 animate-pulse uppercase tracking-[0.2em] drop-shadow-md">
          Decrypting Mission Data... {Math.floor(progress)}%
        </p>
      </div>

      {/* Right Column: Image */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-6 md:p-12 z-10 bg-black">
        <img
          src={heistBg}
          alt="La Casa De IPE Heist Background"
          className="max-h-[85%] max-w-[90%] object-contain drop-shadow-[0_0_30px_rgba(139,0,0,0.25)]"
        />
      </div>
    </div>
  );
}
