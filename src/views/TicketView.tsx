import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, QrCode } from "lucide-react";

interface TicketViewProps {
  eventId: number;
  onViewChange: (view: "hub" | "dashboard" | "quiz" | "ticket") => void;
}

export default function TicketView({ eventId, onViewChange }: TicketViewProps) {
  const { userData } = useAuth();
  const [eventName, setEventName] = useState<string>("");

  useEffect(() => {
    const EVENTS: Record<number, string> = {
      1: "Treasure Hunt",
      2: "BizComp",
      3: "Integration Bee",
      4: "Tug of War",
      5: "Case Competition Seminar",
      6: "Debate Tournament",
      7: "Chess Tournament",
      8: "FIFA",
      9: "PES",
      10: "Soccer (Football)",
      11: "UNO",
      12: "Card 29",
      13: "Ludo",
      14: "Musical Chairs",
      15: "Pillow Passing",
      16: "Mechanical Drawing",
      17: "Mortal Kombat",
      18: "Elonti Belonti",
      19: "Table Tennis",
      20: "Ospi",
      21: "Guess the Song or Movie",
      22: "Quiz: Football",
      23: "Quiz on Sirat",
      24: "Type Racing",
      25: "Photography Competition",
      26: "Memes Competition",
      27: "Art Contest",
      28: "Cultural Event (The Grand Finale)",
    };
    setEventName(EVENTS[eventId] || "Unknown Operation");

    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }, [eventId]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 px-6 md:px-12 text-white relative z-10 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate(30);
            onViewChange("hub");
          }}
          className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-mono text-sm uppercase tracking-widest">
            Back to Hub
          </span>
        </button>

        <div className="flex justify-center w-full mt-10">
          <div className="relative w-full max-w-md bg-[#111] border border-brand-red/40 p-8 shadow-[0_0_50px_rgba(139,0,0,0.3)] group rounded-sm before:absolute before:-inset-1 before:bg-gradient-to-r before:from-brand-red before:via-brand-gold before:to-brand-red before:-z-10 before:blur-md before:opacity-30">
            {/* Top right corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-brand-red -mt-2 -mr-2"></div>
            {/* Bottom left corner accent */}
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-brand-red -mb-2 -ml-2"></div>

            <div className="text-center mb-8 border-b border-brand-red/30 pb-6 relative">
              <div className="absolute left-1/2 -top-12 -translate-x-1/2 bg-[#111] px-4 font-mono text-xs text-brand-gold tracking-widest uppercase border border-brand-red/50 py-1 rounded-sm shadow-inner shadow-brand-red/20">
                Authorized
              </div>
              <h2 className="font-display text-4xl uppercase tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                Dossier
              </h2>
              <p className="font-mono text-[10px] text-gray-500 mt-2 uppercase tracking-[0.3em]">
                Classified Operation Access
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-black/50 p-4 border-l-2 border-brand-gold-bright">
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  Operation
                </p>
                <p className="font-display text-xl text-white uppercase tracking-wider">
                  {eventName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 p-4 border-l-2 border-brand-red">
                  <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                    Operative Name
                  </p>
                  <p className="font-mono text-sm text-white uppercase truncate">
                    {userData?.name || "Loading..."}
                  </p>
                </div>
                <div className="bg-black/50 p-4 border-l-2 border-brand-red">
                  <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                    Operative ID
                  </p>
                  <p className="font-mono text-sm text-white uppercase truncate">
                    {userData?.studentId || "Loading..."}
                  </p>
                </div>
              </div>

              <div className="bg-black/50 p-4 border-l-2 border-brand-red">
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  Department
                </p>
                <p className="font-mono text-sm text-white uppercase truncate">
                  {userData?.department || "Loading..."}
                </p>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-sm">
                <div className="w-48 h-48 bg-white p-2 rounded-sm relative flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <div className="absolute inset-0 border-2 border-black/10 m-2 border-dashed"></div>
                  <QrCode size={120} className="text-black opacity-80" />
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="font-mono text-xs text-gray-400 mt-4 uppercase tracking-[0.2em] text-center">
                  Scan at Entry Point
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
