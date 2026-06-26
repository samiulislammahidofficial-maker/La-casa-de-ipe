import { Bell, MoreVertical, X, Home, LogIn, Shield, History, CalendarDays, GraduationCap, Mail } from "lucide-react";
import UserProfile from "./UserProfile";
import { useState, useEffect } from "react";
import { ViewType } from "../App";
import { useMockState } from "../context/MockStateContext";
import heistBg from "../../picture/heist-bg.png";


interface TopNavProps {
  onViewChange: (
    view: ViewType,
    eventId?: number,
  ) => void;
  activeView: ViewType;
}

export default function TopNav({ onViewChange, activeView }: TopNavProps) {
  const { user } = useMockState();
  const [showSidebar, setShowSidebar] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (view: ViewType) => {
    if (navigator.vibrate) navigator.vibrate(30);
    onViewChange(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowSidebar(false);
  };

  const handleScrollTo = (id: string) => {
    if (navigator.vibrate) navigator.vibrate(30);
    if (id === 'top') {
       if (activeView !== "hub") onViewChange("hub");
       window.scrollTo({ top: 0, behavior: 'smooth' });
       setShowSidebar(false);
       return;
    }
    
    if (activeView !== "hub") {
      onViewChange("hub");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setShowSidebar(false);
  };

  const handleLoginClick = () => {
    if (navigator.vibrate) navigator.vibrate(30);
    window.dispatchEvent(new CustomEvent("request-login"));
    setShowSidebar(false);
  };

  const toggleSidebar = () => {
    if (navigator.vibrate) navigator.vibrate(30);
    setShowSidebar(!showSidebar);
  };

  // Temporarily removed "About Us" per Task 3
  const mainLinks = [
    { name: "Home", type: "view", target: "hub" as ViewType, icon: Home },
    ...(user ? [{ name: "User Dashboard", type: "view", target: "userDashboard" as ViewType, icon: Shield }] : []),
    { name: "Events", type: "scroll", target: "events-section" as ViewType, icon: CalendarDays },
    { name: "Sponsors", type: "view", target: "sponsors" as ViewType, icon: Shield },
    { name: "Last Year Event Page", type: "view", target: "lastYear" as ViewType, icon: History },
    { name: "Alumni", type: "view", target: "alumni" as ViewType, icon: GraduationCap },
    { name: "Contact Us", type: "scroll", target: "contact-section" as ViewType, icon: Mail },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
        {/* Unscrolled Background Layer (Gradient) */}
        <div 
          className={`absolute inset-0 -z-10 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-500 pointer-events-none ${scrolled ? "opacity-0" : "opacity-100"}`}
        ></div>
        
        {/* Scrolled Background Layer (Solid, Blur, Border, Shadow) */}
        <div 
          className={`absolute inset-0 -z-10 bg-black/85 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-opacity duration-500 pointer-events-none ${scrolled ? "opacity-100" : "opacity-0"}`}
        ></div>

        <div className="flex justify-between items-center w-full px-6 max-w-7xl mx-auto">
          {/* Brand */}
          <button 
            onClick={() => handleScrollTo('top')} 
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border border-brand-red/50 group-hover:border-brand-red transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(139,0,0,0.5)]">
              <img
                src={heistBg}
                alt="La Casa De IPE Event Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="font-display text-2xl text-white tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] hidden sm:block group-hover:text-brand-red-light transition-colors duration-500">
              LA CASA DE IPE
            </div>
          </button>

          {/* Desktop links - Center Aligned */}
          <div className="hidden md:flex gap-10 items-center justify-center flex-1 ml-8">
            <button
              onClick={() => handleNavClick("hub")}
              className={`font-mono text-[15px] md:text-[16px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative group hover:scale-105 hover:translate-y-[-1px] ${activeView === "hub" ? "text-brand-gold-bright drop-shadow-[0_0_8px_rgba(233,195,73,0.7)]" : "text-gray-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"}`}
            >
              Terminal
              {activeView === "hub" ? (
                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-brand-gold-bright shadow-[0_0_10px_rgba(233,195,73,1)] animate-pulse"></span>
              ) : (
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
              )}
            </button>
            <button
              onClick={() => handleNavClick("quiz")}
              className={`font-mono text-[15px] md:text-[16px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative group hover:scale-105 hover:translate-y-[-1px] ${activeView === "quiz" ? "text-brand-gold-bright drop-shadow-[0_0_8px_rgba(233,195,73,0.7)]" : "text-gray-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"}`}
            >
              Heist Quiz
              {activeView === "quiz" ? (
                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-brand-gold-bright shadow-[0_0_10px_rgba(233,195,73,1)] animate-pulse"></span>
              ) : (
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
              )}
            </button>
            {user && (
              <button
                onClick={() => handleNavClick("userDashboard")}
                className={`font-mono text-[15px] md:text-[16px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative group hover:scale-105 hover:translate-y-[-1px] ${activeView === "userDashboard" ? "text-brand-gold-bright drop-shadow-[0_0_8px_rgba(233,195,73,0.7)]" : "text-gray-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"}`}
              >
                User Dashboard
                {activeView === "userDashboard" ? (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-brand-gold-bright shadow-[0_0_10px_rgba(233,195,73,1)] animate-pulse"></span>
                ) : (
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                )}
              </button>
            )}
            <button
              onClick={() => handleNavClick("dashboard")}
              className={`font-mono text-[15px] md:text-[16px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative group hover:scale-105 hover:translate-y-[-1px] ${activeView === "dashboard" ? "text-brand-red drop-shadow-[0_0_8px_rgba(139,0,0,0.8)]" : "text-gray-400 hover:text-brand-red hover:drop-shadow-[0_0_8px_rgba(139,0,0,0.5)]"}`}
            >
              Admin Dashboard
              {activeView === "dashboard" ? (
                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-brand-red shadow-[0_0_10px_rgba(139,0,0,1)] animate-pulse"></span>
              ) : (
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-brand-red transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(139,0,0,0.8)]"></span>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button className="text-gray-400 hover:text-brand-gold-bright transition-colors duration-300 relative hidden md:block">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-red rounded-full shadow-[0_0_5px_rgba(139,0,0,0.8)] animate-pulse"></span>
            </button>
            
            <div className="block">
              <UserProfile />
            </div>
            
            <button
              className="text-gray-400 hover:text-brand-gold-bright transition-all duration-300 hover:scale-110 p-2"
              onClick={toggleSidebar}
            >
              <MoreVertical size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Global Sidebar Drawer */}
      {showSidebar && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80" onClick={toggleSidebar}></div>
          <div className="relative w-full max-w-sm h-full bg-[#050505] border-l border-brand-red/30 shadow-[-20px_0_50px_rgba(139,0,0,0.15)] flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between p-8 border-b border-white/5 shrink-0 bg-gradient-to-r from-transparent to-brand-red/5">
              <h2 className="font-display tracking-widest text-xl text-brand-gold-bright uppercase drop-shadow-[0_0_10px_rgba(233,195,73,0.3)]">
                Global Operations
              </h2>
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-brand-red transition-colors duration-300 hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
              <div className="md:hidden flex flex-col gap-3 pb-6 border-b border-white/5 mb-2">
                <UserProfile />
              </div>

              {mainLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.name}
                    onClick={() => {
                      if (link.type === 'view') {
                        handleNavClick(link.target as ViewType);
                      } else {
                        handleScrollTo(link.target);
                      }
                    }}
                    className="flex items-center gap-4 w-full text-left p-4 border border-transparent bg-white/5 rounded-lg hover:bg-brand-red/10 hover:border-brand-red/30 text-gray-300 hover:text-white transition-all duration-300 group"
                  >
                    <Icon className="text-brand-gold-bright/70 group-hover:text-brand-gold-bright transition-colors duration-300" size={18} />
                    <span className="font-mono text-xs uppercase tracking-widest">{link.name}</span>
                  </button>
                );
              })}
              
              <button
                onClick={handleLoginClick}
                className="flex items-center gap-4 w-full text-left p-4 border border-brand-red/20 bg-brand-red/5 rounded-lg hover:bg-brand-red/80 hover:text-white text-brand-red transition-all duration-300 group mt-6 shadow-[0_0_15px_rgba(139,0,0,0.1)] hover:shadow-[0_0_20px_rgba(139,0,0,0.4)]"
              >
                <LogIn className="text-brand-red group-hover:text-white transition-colors duration-300" size={18} />
                <span className="font-mono text-xs uppercase tracking-widest">Login / Authenticate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
