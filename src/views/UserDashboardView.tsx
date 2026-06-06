import { useState } from "react";
import { useMockState } from "../context/MockStateContext";
import { ViewType } from "../App";
import {
  User,
  Info,
  Mail,
  CheckCircle,
  Ticket,
  List,
  Shield,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface UserDashboardViewProps {
  onViewChange: (view: ViewType) => void;
}

export default function UserDashboardView({ onViewChange }: UserDashboardViewProps) {
  const { user, approvedRequests, logout } = useMockState();
  const [activeTab, setActiveTab] = useState("Profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl text-brand-red font-display uppercase mb-4">Access Denied</h2>
        <p className="text-gray-400 font-mono mb-8">You must be logged in to access the Operative Dashboard.</p>
        <button 
          onClick={() => {
            onViewChange("hub");
            window.dispatchEvent(new CustomEvent('request-login'));
          }}
          className="px-6 py-2 bg-brand-red text-white uppercase tracking-widest font-mono text-sm hover:bg-red-800 transition-colors rounded"
        >
          Login
        </button>
      </div>
    );
  }

  const TABS = [
    { name: "Profile", icon: User },
    { name: "About Us", icon: Info },
    { name: "Contact", icon: Mail },
    { name: "Registered Event", icon: CheckCircle },
    { name: "Event Pass", icon: Ticket },
    { name: "Event List", icon: List },
    { name: "Sponsors", icon: Shield },
  ];

  const handleLogout = () => {
    logout();
    onViewChange("hub");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div className="bg-[#151515] border border-white/10 rounded-xl p-8 max-w-2xl">
            <h3 className="text-2xl font-display uppercase text-brand-gold-bright mb-6">Operative Profile</h3>
            <div className="space-y-4 font-mono text-gray-300">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Designation Name</span>
                <span className="text-lg text-white">{user.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Comm Link (Email)</span>
                <span className="text-lg text-white">{user.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Operative ID (Roll)</span>
                <span className="text-lg text-white">{user.rollNumber}</span>
              </div>
            </div>
          </div>
        );
      case "Registered Event":
        return (
          <div className="bg-[#151515] border border-brand-red/20 rounded-xl p-8 max-w-4xl shadow-[0_0_20px_rgba(139,0,0,0.1)]">
            <h3 className="text-2xl font-display uppercase text-white mb-6">Approved Operations</h3>
            {approvedRequests.length === 0 ? (
              <p className="text-gray-500 font-mono">No operations have been approved yet. Check the Event List to request an assignment.</p>
            ) : (
              <ul className="space-y-4">
                {approvedRequests.map(req => (
                  <li key={req} className="flex items-center gap-4 bg-[#111] border border-brand-red/40 p-4 rounded-lg">
                    <CheckCircle className="text-green-500" size={24} />
                    <span className="font-mono text-lg text-white tracking-wider">{req}</span>
                    <span className="ml-auto font-mono text-xs uppercase tracking-widest text-brand-gold-bright border border-brand-gold-bright/30 px-3 py-1 rounded">Cleared</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return (
          <div className="bg-[#151515] border border-white/10 rounded-xl p-8 text-center py-20">
            <Shield className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-2xl font-display uppercase text-gray-400 mb-2">{activeTab}</h3>
            <p className="font-mono text-gray-500 text-sm max-w-md mx-auto">This sector of the dashboard is currently sealed. Intel for {activeTab} will be transmitted soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col md:flex-row font-body relative pt-16 md:pt-0">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-[#000]/90 backdrop-blur border-b border-brand-red/20 flex items-center justify-between px-4 z-50">
        <h1 className="font-display text-xl text-brand-red uppercase tracking-widest">Dashboard</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed md:relative top-16 md:top-0 left-0 w-64 h-[calc(100vh-4rem)] md:h-screen bg-[#0e0e0e]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col z-40 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-white/10 hidden md:block">
          <h2 className="font-display text-2xl text-brand-red uppercase tracking-widest glow-red-text">Operative</h2>
          <p className="font-mono text-xs text-gray-500 tracking-widest mt-1">SECURE TERMINAL</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm uppercase tracking-widest transition-all ${
                  isActive 
                  ? 'bg-brand-red/10 text-brand-red-light border border-brand-red/50 shadow-[0_0_15px_rgba(139,0,0,0.2)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="text-left">{tab.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <button 
            onClick={() => onViewChange("hub")}
            className="w-full mb-2 flex items-center justify-center gap-2 py-2 border border-white/20 text-white hover:bg-white/10 transition-colors uppercase font-mono text-xs tracking-widest rounded"
          >
            Return to Hub
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-red-900/40 text-gray-400 hover:text-red-400 transition-colors uppercase font-mono text-xs tracking-widest rounded"
          >
            <LogOut size={16} />
            Abort Mission (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 lg:p-16 overflow-y-auto max-h-screen">
        <header className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-white uppercase tracking-wider mb-2">{activeTab}</h1>
          <div className="h-1 w-24 bg-brand-red glow-red"></div>
        </header>

        <div className="animate-fade-in-up">
          {renderContent()}
        </div>
      </main>

    </div>
  );
}
