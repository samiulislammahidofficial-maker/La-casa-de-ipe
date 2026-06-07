import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Shield, CalendarDays, LogIn } from "lucide-react";
import { ViewType } from "../App";
import { useMockState } from "../context/MockStateContext";
import heistBg from "../../picture/heist-bg.png";

interface FloatingMenuProps {
  onViewChange: (view: ViewType, eventId?: number) => void;
}

export default function FloatingMenu({ onViewChange }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useMockState();
  const constraintsRef = useRef(null);

  const toggleMenu = () => {
    if (navigator.vibrate) navigator.vibrate(30);
    setIsOpen(!isOpen);
  };

  const handleNavClick = (view: ViewType) => {
    if (navigator.vibrate) navigator.vibrate(30);
    onViewChange(view);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginClick = () => {
    if (navigator.vibrate) navigator.vibrate(30);
    window.dispatchEvent(new CustomEvent("request-login"));
    setIsOpen(false);
  };

  const menuItems = [
    { name: "Terminal", view: "hub" as ViewType, icon: Home },
    { name: "Heist Quiz", view: "quiz" as ViewType, icon: CalendarDays },
    { name: "Admin Dashboard", view: "dashboard" as ViewType, icon: Shield },
    ...(user ? [{ name: "User Dashboard", view: "userDashboard" as ViewType, icon: Shield }] : []),
  ];

  return (
    <>
      {/* Invisible constraints box covering the viewport */}
      <div 
        ref={constraintsRef} 
        className="fixed inset-4 z-[9999] pointer-events-none" 
      />

      {/* Draggable container using hardware acceleration */}
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        initial={{ x: window.innerWidth - 100, y: window.innerHeight / 2 }}
        className="fixed z-[10000] flex flex-col items-end gap-4 pointer-events-auto"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-black/80 backdrop-blur-md border border-brand-red/30 p-2 rounded-2xl shadow-[0_0_30px_rgba(139,0,0,0.3)] flex flex-col gap-2 min-w-[200px]"
            >
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.view)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-red/20 text-gray-300 hover:text-white transition-colors w-full text-left"
                  >
                    <Icon size={18} className="text-brand-gold-bright" />
                    <span className="font-mono text-xs uppercase tracking-wider">{item.name}</span>
                  </button>
                );
              })}
              
              <div className="h-[1px] bg-white/10 my-1 mx-2" />
              
              <button
                onClick={handleLoginClick}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-red/80 bg-brand-red/10 text-brand-red hover:text-white transition-colors w-full text-left"
              >
                <LogIn size={18} />
                <span className="font-mono text-xs uppercase tracking-wider">Login</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular Drag Button */}
        <motion.button
          onClick={toggleMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-red shadow-[0_0_20px_rgba(139,0,0,0.5)] bg-black self-end cursor-grab active:cursor-grabbing"
        >
          <img
            src={heistBg}
            alt="Event Logo"
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        </motion.button>
      </motion.div>
    </>
  );
}
