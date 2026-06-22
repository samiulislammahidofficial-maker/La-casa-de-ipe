import { useState } from "react";
import { User, LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { firebaseUser, userData, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-8 h-8 animate-pulse bg-white/10 rounded-full"></div>
    );
  }

  if (!firebaseUser) {
    return (
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('request-login'))}
        className="bg-brand-red hover:bg-red-800 text-white font-display text-lg px-6 py-1.5 rounded glow-red uppercase tracking-wider transition-all active:scale-95 border border-red-900 border-b-red-950"
      >
        LOGIN
      </button>
    );
  }

  const handleSignOut = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full border-2 border-brand-gold-bright flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] transition-colors"
      >
        <User size={20} className="text-brand-gold-bright" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-14 right-0 w-80 bg-[#1a1a1a] border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)] rounded-lg z-50 overflow-hidden font-body text-white">
            <div className="flex justify-between items-center bg-[#111] p-4 border-b border-white/10">
              <h3 className="font-display uppercase tracking-widest text-brand-gold-bright">
                Operative Profile
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Codename
                </div>
                <div className="font-mono text-lg">
                  {userData?.name || firebaseUser.displayName || "Unknown"}
                </div>
              </div>
              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Student ID
                </div>
                <div className="font-mono text-lg">
                  {userData?.studentId || "N/A"}
                </div>
              </div>
              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Department
                </div>
                <div className="font-mono text-lg">
                  {userData?.department || "N/A"}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Registered Events
                </div>
                {userData?.registered_events && userData.registered_events.length > 0 ? (
                  <ul className="space-y-2">
                    {userData.registered_events.map((evt: string) => (
                      <li
                        key={evt}
                        className="font-mono text-sm bg-white/5 border border-white/10 p-2 rounded"
                      >
                        {evt}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="font-mono text-sm text-gray-400 italic">
                    No operations assigned yet.
                  </div>
                )}
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 mt-4 text-brand-red text-sm font-mono uppercase tracking-widest hover:bg-brand-red/10 rounded transition-colors"
              >
                <LogOut size={16} /> Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
