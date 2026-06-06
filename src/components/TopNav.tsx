import { Bell, Menu, X } from "lucide-react";
import UserProfile from "./UserProfile";
import { useState } from "react";
import { EVENTS } from "./EventCards";

interface TopNavProps {
  onViewChange: (
    view: "hub" | "dashboard" | "quiz" | "ticket" | "eventDetails",
    eventId?: number,
  ) => void;
  activeView: "hub" | "dashboard" | "quiz" | "ticket" | "eventDetails";
}

export default function TopNav({ onViewChange, activeView }: TopNavProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleNavClick = (view: "hub" | "dashboard" | "quiz") => {
    if (navigator.vibrate) navigator.vibrate(30);
    onViewChange(view);
  };

  const toggleSidebar = () => {
    if (navigator.vibrate) navigator.vibrate(30);
    setShowSidebar(!showSidebar);
  };

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

          {/* Links */}
          <div className="hidden md:flex gap-8 items-center">
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
              onClick={toggleSidebar}
              className="font-mono text-sm text-gray-400 hover:text-brand-gold transition-colors duration-300"
            >
              Events
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
            <button
              className="text-white hover:text-brand-gold transition-colors md:hidden"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            <button className="text-white hover:text-brand-gold transition-colors relative hidden md:block">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-red rounded-full"></span>
            </button>
            <UserProfile />
          </div>
        </div>
      </nav>

      {/* Mobile/Events Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={toggleSidebar}></div>
          <div className="relative w-full max-w-sm h-full bg-[#111] border-l border-brand-red/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <h2 className="font-display tracking-widest text-2xl text-brand-gold-bright uppercase">
                ALL OPERATIONS
              </h2>
              <button
                onClick={toggleSidebar}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              <div className="md:hidden flex flex-col gap-2 pb-4 border-b border-white/10">
                <button
                  onClick={() => {
                    handleNavClick("hub");
                    toggleSidebar();
                  }}
                  className={`font-mono text-left px-4 py-2 border border-white/10 rounded transition-all duration-300 ${activeView === "hub" ? "bg-white/10 text-brand-gold-bright" : "text-white hover:bg-white/5"}`}
                >
                  Terminal
                </button>
                <button
                  onClick={() => {
                    handleNavClick("quiz");
                    toggleSidebar();
                  }}
                  className={`font-mono text-left px-4 py-2 border border-white/10 rounded transition-all duration-300 ${activeView === "quiz" ? "bg-white/10 text-brand-gold-bright" : "text-gray-400 hover:text-white"}`}
                >
                  Heist Quiz
                </button>
                <button
                  onClick={() => {
                    handleNavClick("dashboard");
                    toggleSidebar();
                  }}
                  className={`font-mono text-left px-4 py-2 border border-white/10 rounded transition-all duration-300 ${activeView === "dashboard" ? "bg-brand-red/20 text-brand-gold-bright" : "text-brand-red hover:bg-brand-red/10"}`}
                >
                  Admin Dashboard / Login
                </button>
              </div>

              <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest px-2">Events List</h3>

              <div className="space-y-2">
                {EVENTS.map((evt) => {
                  const Icon = evt.icon;
                  return (
                    <div
                      key={evt.id}
                      className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 hover:border-brand-red/50 rounded transition-colors group cursor-pointer"
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(20);
                        onViewChange("eventDetails", evt.id);
                        toggleSidebar();
                      }}
                    >
                      <div className="p-2 bg-black/50 rounded group-hover:text-brand-red text-gray-400 transition-colors">
                        <Icon size={20} />
                      </div>
                      <span className="font-mono text-sm text-gray-200 group-hover:text-white transition-colors uppercase tracking-wider">
                        {evt.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
