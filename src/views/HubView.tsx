import { useState } from "react";
import TopNav from "../components/TopNav";
import AccessPassModal from "../components/AccessPassModal";
import BlueprintReveal from "../components/BlueprintReveal";
import EventCards from "../components/EventCards";

interface HubViewProps {
  onViewChange: (
    view: "hub" | "dashboard" | "quiz" | "ticket" | "eventDetails",
    eventId?: number,
  ) => void;
  onRegisterSuccess?: (eventId: number) => void;
}

export default function HubView({
  onViewChange,
  onRegisterSuccess,
}: HubViewProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="pt-[72px]">
      <TopNav onViewChange={onViewChange} activeView="hub" />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEOUkmkDwjoi1nRJ7cETY672tqMi3MXk2N0VYb1j1eqs0mRrVA85rJowX1p4tlMVbs2peKv8gi4bQOhZ7mHAJ6nLBWto8x6cI9rA3aKhhiyvGCpDHi6ZwNctAc6ckY4rjul4Ymnir6PRbrgfEO_iz_JEMxHDAqzZWq3X2Trik4QhVPy02d3ObLcGUWMyXkR6QxF-u2Jh1y8LutWLBVsjoPH0KKviRmZen4cyDImkicgiF1bLEOTlN0J5QrbncSQJivWq0bNfutW1ys"
            alt="Vault Heist"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-block border border-brand-gold-bright/30 px-4 py-1 rounded-full mb-6 bg-black/50 backdrop-blur-md">
            <span className="font-mono text-sm text-brand-gold-bright tracking-widest">
              MISSION INITIATED
            </span>
          </div>

          <div className="w-48 h-48 md:w-64 md:h-64 mb-8 rounded-full overflow-hidden border-4 border-brand-red shadow-[0_0_50px_rgba(139,0,0,0.5)]">
            <img
              src="https://i.postimg.cc/fRvczJRF/708852684-1373519991306664-7382593907580718207-n.jpg"
              alt="La Casa De IPE Event Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="font-display text-7xl md:text-[140px] leading-none text-white tracking-tighter uppercase mb-12 drop-shadow-2xl">
            La Casa <br />
            <span className="text-brand-red">De IPE</span>
          </h1>

          <button
            onClick={() => setShowPass(true)}
            className="group relative overflow-hidden bg-brand-red text-white font-display text-2xl px-12 py-5 rounded-sm btn-glow uppercase tracking-wider hover:bg-red-800 transition-colors border border-red-900 border-b-red-950 shadow-2xl"
          >
            <BlueprintReveal />
            <span className="relative z-10 pointer-events-none">
              Enter the Vault
            </span>
          </button>
        </div>
      </section>

      {/* Events Board */}
      <section className="py-24 relative overflow-hidden bg-[#0c0c0c]">
        <EventCards
          onRegisterSuccess={onRegisterSuccess}
          onViewChange={onViewChange}
        />
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#111] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
          {/* Organizer Logos */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-8 items-center justify-center w-full">
            <div className="flex flex-col items-center">
              <span className="font-mono text-xs text-gray-500 tracking-widest uppercase mb-4">
                Organized By
              </span>
              <div className="bg-white/5 p-2 rounded-full border border-white/10 flex items-center justify-center w-28 h-28 md:w-36 md:h-36 overflow-hidden">
                <img
                  src="https://i.postimg.cc/tJyR4CTd/1779890856249.png"
                  alt="BUET IPE 24 Logo"
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <span className="font-display text-3xl text-brand-red opacity-50 px-4 hidden md:block">
              ×
            </span>

            <div className="flex flex-col items-center mt-6 md:mt-0">
              <span className="font-mono text-xs text-gray-500 tracking-widest uppercase mb-4">
                In Association With
              </span>
              <div className="bg-white/5 p-2 rounded-full flex items-center justify-center border border-white/10 w-28 h-28 md:w-36 md:h-36 overflow-hidden">
                <img
                  src="https://i.postimg.cc/VLk1Ghb5/466001923-558542163817971-8889883612451577029-n.jpg"
                  alt="AIPE Logo"
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>

          {/* Footer Bottom Setup */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/10">
            <div className="font-display text-3xl text-brand-red-light tracking-widest">
              BUET DHAKA
            </div>
            <div className="flex gap-6">
              <span className="font-mono text-sm text-gray-500 hover:text-white cursor-pointer transition-colors">
                Sponsors
              </span>
              <span className="font-mono text-sm text-gray-500 hover:text-white cursor-pointer transition-colors">
                Terms
              </span>
              <span className="font-mono text-sm text-gray-500 hover:text-white cursor-pointer transition-colors">
                Contact
              </span>
            </div>
            <div className="font-mono text-xs text-gray-600">
              © 2024 BUET IPE 24. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>

      {showPass && <AccessPassModal onClose={() => setShowPass(false)} />}
    </div>
  );
}
