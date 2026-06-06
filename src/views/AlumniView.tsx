import { Quote } from "lucide-react";

const ALUMNI = [
  {
    id: 1,
    name: "Professor",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    quote: "The strategic depth of this reception changed how I approach problem solving in the real world. A flawless operation.",
    role: "Mastermind, Class of '24"
  },
  {
    id: 2,
    name: "Tokyo",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    quote: "High energy, high stakes, and unforgettable memories. IPE knows how to pull off the ultimate heist.",
    role: "Operative, Class of '23"
  },
  {
    id: 3,
    name: "Berlin",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    quote: "It wasn't just about the games; it was about the bonds forged in the heat of competition. Pure gold.",
    role: "Strategist, Class of '22"
  },
  {
    id: 4,
    name: "Nairobi",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    quote: "I've been to many events, but the execution and aesthetic of La Casa de IPE remains unmatched.",
    role: "Logistics, Class of '23"
  }
];

export default function AlumniView({ onViewChange }: { onViewChange: (view: any) => void }) {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 bg-[#111] text-white font-mono flex flex-col items-center">
      <div className="max-w-6xl w-full">
        <h1 className="font-display text-4xl md:text-5xl text-brand-red uppercase tracking-widest mb-4 text-center drop-shadow-lg">
          Hall of Legends
        </h1>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto uppercase tracking-widest text-sm">
          Hear from the masterminds who executed previous operations flawlessly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ALUMNI.map((alumnus) => (
            <div key={alumnus.id} className="bg-[#151515]/90 border border-brand-gold-bright/20 p-6 rounded-xl relative overflow-hidden group hover:border-brand-gold-bright transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(233,195,73,0.15)] flex flex-col">
              <Quote className="absolute top-4 right-4 text-brand-gold-bright/10 group-hover:text-brand-gold-bright/30 transition-colors" size={48} />
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <img src={alumnus.avatar} alt={alumnus.name} className="w-16 h-16 rounded-full border-2 border-brand-red object-cover" />
                <div>
                  <h3 className="font-display text-xl uppercase text-white">{alumnus.name}</h3>
                  <p className="text-xs text-brand-gold-bright font-mono uppercase tracking-widest">{alumnus.role}</p>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed italic relative z-10 flex-grow">
                "{alumnus.quote}"
              </p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-16">
          <button
            onClick={() => onViewChange("hub")}
            className="px-8 py-3 border border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-mono text-sm uppercase tracking-widest transition-all rounded-lg shadow-[0_0_15px_rgba(139,0,0,0.2)]"
          >
            Return to Base
          </button>
        </div>
      </div>
    </div>
  );
}
