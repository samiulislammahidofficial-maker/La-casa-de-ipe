import { useState } from "react";
import TopNav from "../components/TopNav";
import AccessPassModal from "../components/AccessPassModal";
import BlueprintReveal from "../components/BlueprintReveal";
import EventCards from "../components/EventCards";
import { ViewType } from "../App";
import bgImage from "../../picture/mechasamnerpic.png.png";
import heistBg from "../../picture/heist-bg.png";


interface HubViewProps {
  onViewChange: (
    view: ViewType,
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
              src={heistBg}
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
      <section id="events-section" className="py-24 relative overflow-hidden bg-[#0c0c0c]">
        <EventCards
          onRegisterSuccess={onRegisterSuccess}
          onViewChange={onViewChange}
        />
      </section>

      {/* Department Overview */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
          <header className="mb-12 text-center md:text-left">
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-widest text-brand-red glow-red-text mb-4">
              Department Overview
            </h2>
            <div className="h-1 w-24 bg-brand-red glow-red mx-auto md:mx-0"></div>
          </header>

          <div className="space-y-8 font-body text-gray-300 text-lg md:text-xl leading-relaxed tracking-wide bg-[#111]/60 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <p>
              The Department of Industrial and Production Engineering (IPE) at BUET is one of the leading departments in Bangladesh, specializing in industrial engineering, production systems, and operations research. Established as part of Bangladesh University of Engineering and Technology (BUET), the IPE department has significantly contributed to the advancement of industrial practices in the country.
            </p>
            <p>
              With a dynamic student body of approximately 600 students, the department offers a comprehensive undergraduate program and 5 postgraduate batches, reflecting BUET's commitment to providing high-quality education in the field of industrial engineering. The department fosters a collaborative learning environment where students are equipped with the necessary skills to solve complex industrial problems and contribute effectively to both national and global industries.
            </p>
            <p>
              Each year, students are admitted to the department through a highly competitive selection process, reinforcing the department's commitment to attracting the best minds in the country. The IPE department boasts a faculty of experienced professors and researchers who guide students through a rigorous curriculum and provide opportunities for real-world applications of industrial engineering principles.
            </p>
            <p>
              The IPE department at BUET has a robust alumni network, with graduates making significant contributions across industries globally. Many alumni are working in top organizations in countries such as the USA, Canada, the UK, and various countries in the Middle East, as well as contributing to the development of industrial practices in Bangladesh.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact-section" className="border-t border-white/10 bg-[#111] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
          {/* Organizer Logos */}
          <div className="flex flex-row gap-6 md:gap-8 items-center justify-start w-full mb-12">
            <div className="flex flex-col items-start">
              <span className="font-mono text-[10px] md:text-xs text-gray-500 tracking-widest uppercase mb-3">
                Organized By
              </span>
              <div className="bg-white/5 p-2 rounded-full border border-white/10 flex items-center justify-center w-20 h-20 md:w-28 md:h-28 overflow-hidden shrink-0">
                <img
                  src="https://i.postimg.cc/tJyR4CTd/1779890856249.png"
                  alt="BUET IPE 24 Logo"
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <span className="font-display text-2xl text-brand-red opacity-50 px-2 shrink-0">
              ×
            </span>

            <div className="flex flex-col items-start">
              <span className="font-mono text-[10px] md:text-xs text-gray-500 tracking-widest uppercase mb-3">
                In Association With
              </span>
              <div className="bg-white/5 p-2 rounded-full flex items-center justify-center border border-white/10 w-20 h-20 md:w-28 md:h-28 overflow-hidden shrink-0">
                <img
                  src="https://i.postimg.cc/VLk1Ghb5/466001923-558542163817971-8889883612451577029-n.jpg"
                  alt="AIPE Logo"
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            </div>
            
            {/* Empty space reserved for future sponsor logos on the right */}
            <div className="flex-1"></div>
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
