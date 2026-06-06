import { useState, useEffect } from "react";

export default function CountdownTimer({ 
  targetDate, 
  variant = 'default' 
}: { 
  targetDate: string;
  variant?: 'default' | 'bomb';
}) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, new Date(targetDate).getTime() - Date.now()),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, new Date(targetDate).getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const pad = (num: number) => num.toString().padStart(2, "0");

  if (variant === 'bomb') {
    return (
      <div className="font-mono text-brand-red text-lg tracking-[0.2em] bg-black/80 inline-block px-3 py-1 border border-brand-red/30 rounded mt-2">
        {pad(days)} : {pad(hours)} : {pad(minutes)} : {pad(seconds)}
      </div>
    );
  }

  return (
    <div className="flex bg-[#0a0a0a] border-l-4 border-brand-red p-4 mt-6 md:mt-0 mb-6 w-full max-w-4xl shadow-[0_0_15px_rgba(139,0,0,0.2)]">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full">
        <div className="mb-4 md:mb-0 md:mr-8 text-center md:text-left">
          <h3 className="font-mono text-brand-red-light text-xs uppercase tracking-[0.2em] mb-1 opacity-80">
            Operation Commences In
          </h3>
          <p className="font-display text-xl md:text-2xl text-white uppercase tracking-wider">
            The Royal Mint Siege
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4 font-mono">
          <TimeUnit value={pad(days)} label="DAYS" />
          <span className="text-brand-red text-2xl animate-pulse">:</span>
          <TimeUnit value={pad(hours)} label="HRS" />
          <span className="text-brand-red text-2xl animate-pulse">:</span>
          <TimeUnit value={pad(minutes)} label="MIN" />
          <span className="text-brand-red text-2xl animate-pulse">:</span>
          <TimeUnit value={pad(seconds)} label="SEC" />
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#111] border border-white/10 px-3 py-2 md:px-4 md:py-3 rounded text-2xl md:text-4xl text-brand-gold-bright shadow-inner">
        {value}
      </div>
      <span className="text-[10px] md:text-xs text-gray-500 mt-2 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

