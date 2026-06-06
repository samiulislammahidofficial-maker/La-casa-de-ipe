import { Bell, MoreVertical, X, Home, LogIn, Info, Shield, History, CalendarDays, GraduationCap } from "lucide-react";
import UserProfile from "./UserProfile";
import { useState } from "react";
import { EVENTS } from "./EventCards";
import { ViewType } from "../App";

interface TopNavProps {
  onViewChange: (
    view: ViewType,
    eventId?: number,
  ) => void;
  activeView: ViewType;
}

export default function TopNav({ onViewChange, activeView }: TopNavProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleNavClick = (view: ViewType) => {
    if (navigator.vibrate) navigator.vibrate(30);
    onViewChange(view);
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

  const mainLinks = [
    { name: "Home", view: "hub", icon: Home },
    { name: "About Us", view: "about", icon: Info },
    { name: "Sponsors", view: "sponsors", icon: Shield },
    { name: "Last Year Event Page", view: "lastYear", icon: History },
    { name: "Events", view: "hub", icon: CalendarDays },
    { name: "Alumni", view: "alumni", icon: GraduationCap },
  ] as const;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-red">
              <img
                src="https://i.postimg.cc/fRvczJRF/708852684-1373519991306664-7382593907580718207-n.jpg"
                alt="La Casa De IPE Event Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-display text-2xl text-brand-red-light tracking-tighter uppercase drop-shadow-lg hidden sm:block">
              LA CASA DE IPE
            </div>
          </div>

          {/* Desktop links can still show some primary actions, but we will focus on the drawer */}
          <div className="hidden md:flex gap-8 items-center mr-auto ml-12">
            <button
              onClick={() => handleNavClick("hub")}
              className={`font-mono text-sm transition-all duration-300 ${activeView === "hub" ? "text-brand-gold-bright border-b-2 border-brand-gold-bright pb-1" : "text-white hover:text-brand-gold"}`}
            >
              Terminal
            </button>
            <button
              onClick={() => handleNavClick("quiz")}
              className={`font-mono text-sm transition-all duration-300 ${activeView === "quiz" ? "text-brand-gold-bright border-b-2 border-brand-gold-bright pb-1" : "text-gray-400 hover:text-brand-gold"}`}
            >
              Heist Quiz
            </button>
            <button
              onClick={() => handleNavClick("dashboard")}
              className={`font-mono text-sm transition-all duration-300 ${activeView === "dashboard" ? "text-brand-gold-bright border-b-2 border-brand-gold-bright pb-1" : "text-brand-red hover:text-brand-gold"}`}
            >
              Admin Dashboard
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button className="text-white hover:text-brand-gold transition-colors relative hidden md:block">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-red rounded-full"></span>
            </button>
            <UserProfile />
            
            <button
              className="text-brand-gold-bright hover:text-white transition-colors"
              onClick={toggleSidebar}
            >
              <MoreVertical size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Global Sidebar Drawer */}
      {showSidebar && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-md">
          <div className="absolute inset-0" onClick={toggleSidebar}></div>
          <div className="relative w-full max-w-sm h-full bg-[#0a0a0a] border-l border-brand-red/30 shadow-[-10px_0_30px_rgba(139,0,0,0.2)] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-gradient-to-r from-transparent to-brand-red/10">
              <h2 className="font-display tracking-widest text-2xl text-brand-gold-bright uppercase">
                Global Nav
              </h2>
              <button
                onClick={toggleSidebar}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
              {mainLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.view)}
                    className="flex items-center gap-4 w-full text-left p-4 border border-white/5 bg-white/5 rounded-lg hover:bg-brand-red/20 hover:border-brand-red/50 text-white transition-all group"
                  >
                    <Icon className="text-brand-gold-bright group-hover:text-white transition-colors" size={20} />
                    <span className="font-mono text-sm uppercase tracking-widest">{link.name}</span>
                  </button>
                );
              })}
              
              <button
                onClick={handleLoginClick}
                className="flex items-center gap-4 w-full text-left p-4 border border-brand-red/30 bg-brand-red/10 rounded-lg hover:bg-brand-red hover:text-white text-brand-red transition-all group mt-4"
              >
                <LogIn className="text-brand-red group-hover:text-white transition-colors" size={20} />
                <span className="font-mono text-sm uppercase tracking-widest">Login / Auth</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
