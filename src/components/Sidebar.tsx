import { LayoutDashboard, BarChart2, Lock, Eye, Truck, Settings, HelpCircle } from 'lucide-react';
import heistBg from "../../picture/heist-bg.png";


interface SidebarProps {
  onViewChange: (view: 'hub' | 'dashboard' | 'quiz') => void;
}

export default function Sidebar({ onViewChange }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col h-full py-6 bg-[#0e0e0e]/95 backdrop-blur-2xl border-r border-white/10 fixed left-0 top-0 w-64 z-40 pt-24">
      
      {/* Profile / Hub */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-red-light/30">
            <img 
              src={heistBg} 
              alt="La Casa De IPE Event Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h2 className="font-display text-xl text-brand-red-light">OPERATIVE HUB</h2>
            <p className="font-mono text-[10px] text-gray-500">STATUS: CLANDESTINE</p>
          </div>
        </div>
        
        <button 
          onClick={() => onViewChange('hub')}
          className="w-full bg-brand-red text-white font-display text-xl uppercase py-2 px-4 rounded hover:bg-red-800 transition-colors duration-300 mt-4 glow-red"
        >
          Terminal Access
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-2">
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200">
          <LayoutDashboard size={20} />
          <span className="font-mono text-sm">Command Center</span>
        </a>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-red-light bg-brand-red/10 border-r-2 border-brand-red transition-all duration-200">
          <BarChart2 size={20} />
          <span className="font-mono text-sm font-bold">Leaderboard</span>
        </a>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200">
          <Lock size={20} />
          <span className="font-mono text-sm">Vault</span>
        </a>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200">
          <Eye size={20} />
          <span className="font-mono text-sm">Intel</span>
        </a>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200">
          <Truck size={20} />
          <span className="font-mono text-sm">Extraction</span>
        </a>
      </nav>

      {/* Footer Settings */}
      <div className="px-4 mt-auto mb-6 space-y-2">
        <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-500 hover:bg-white/5 hover:text-white transition-all">
          <Settings size={18} />
          <span className="font-mono text-sm">Settings</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-500 hover:bg-white/5 hover:text-white transition-all">
          <HelpCircle size={18} />
          <span className="font-mono text-sm">Support</span>
        </a>
      </div>

    </aside>
  );
}
