import { useState, useEffect } from "react";
import {
  Bell,
  Terminal,
  Diamond,
  Shield,
  Wrench,
  Filter,
  Lock,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import CountdownTimer from "../components/CountdownTimer";
import {
  auth,
  db,
  onAuthStateChanged,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy
} from "../lib/firebaseUtils";

interface DashboardViewProps {
  onViewChange: (view: "hub" | "dashboard" | "quiz" | "ticket") => void;
}

export default function DashboardView({ onViewChange }: DashboardViewProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});
  const [filterEvent, setFilterEvent] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().role === "admin") {
            setIsAdmin(true);
            fetchAllUsersAndListenToRegistrations();
          } else {
            setIsAdmin(false);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    let unsubscribeRegs: () => void;

    const fetchAllUsersAndListenToRegistrations = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const map: Record<string, any> = {};
        usersSnapshot.docs.forEach((d) => {
          map[d.id] = d.data();
        });
        setUsersMap(map);

        const q = query(
          collection(db, "registrations"),
          orderBy("timestamp", "desc"),
        );
        unsubscribeRegs = onSnapshot(q, (snapshot) => {
          const regs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRegistrations(regs);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    return () => {
      unsubscribeAuth();
      if (unsubscribeRegs) unsubscribeRegs();
    };
  }, []);

  const uniqueEvents = Array.from(
    new Set(registrations.map((r) => r.eventName)),
  ).sort();

  const filteredRegistrations =
    filterEvent === "ALL"
      ? registrations
      : registrations.filter((r) => r.eventName === filterEvent);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center p-6 font-mono relative overflow-hidden">
        <div className="absolute inset-0 scan-lines pointer-events-none opacity-20"></div>
        <Lock size={64} className="text-brand-red mb-6 animate-pulse" />
        <h1 className="text-3xl md:text-5xl text-brand-red uppercase tracking-widest mb-4 font-display text-center">
          Access Denied
        </h1>
        <p className="text-gray-400 text-center uppercase tracking-widest max-w-md">
          Restricted Vault Area. Only authorized masterminds may enter this section.
        </p>
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('request-login'))}
            className="border border-brand-red bg-brand-red/10 px-6 py-2 text-brand-red hover:bg-brand-red hover:text-white transition-colors uppercase text-sm tracking-widest"
          >
            Agent Login
          </button>
          <button
            onClick={() => onViewChange("hub")}
            className="border border-white/20 px-6 py-2 text-white hover:bg-white hover:text-black transition-colors uppercase text-sm tracking-widest"
          >
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111]">
      <header className="hidden md:flex bg-[#000]/80 backdrop-blur-xl border-b border-brand-red/30 justify-between items-center px-10 h-16 fixed top-0 w-full z-50">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-2xl uppercase tracking-tighter text-brand-red">
            ROYAL MINT PROTOCOL - ADMIN
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-brand-red-light hover:text-white transition-colors">
            <Bell size={20} />
          </button>
          <button className="text-brand-red-light hover:text-white transition-colors">
            <Terminal size={20} />
          </button>
        </div>
      </header>

      <Sidebar onViewChange={onViewChange} />

      <main className="md:ml-64 pt-20 md:pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <CountdownTimer targetDate="2026-12-31T00:00:00Z" />

        <section className="bg-[#151515]/80 backdrop-blur-xl border border-brand-red/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(139,0,0,0.1)] glow-red">
          <div className="px-6 py-5 border-b border-brand-red/20 flex flex-col items-start gap-4 md:flex-row md:items-center justify-between bg-[#1a1a1a]">
            <div>
              <h3 className="font-display text-2xl text-white uppercase tracking-wide">
                Operation Registrations
              </h3>
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-1">
                Total Assigned: {filteredRegistrations.length}
              </p>
            </div>
            <div className="flex border border-white/10 rounded overflow-hidden">
              <div className="bg-white/5 flex items-center justify-center px-3 py-2 border-r border-white/10">
                <Filter size={16} className="text-gray-400" />
              </div>
              <select
                className="bg-[#111] text-white font-mono text-xs uppercase tracking-widest px-4 py-2 outline-none appearance-none cursor-pointer"
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
              >
                <option value="ALL">ALL OPERATIONS</option>
                {uniqueEvents.map((evt) => (
                  <option key={evt} value={evt}>
                    {evt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5 bg-black/40">
                  <th className="p-4 font-mono text-[10px] text-gray-600 font-normal uppercase tracking-widest w-12">
                    #
                  </th>
                  <th className="p-4 font-mono text-[10px] text-gray-400 font-normal uppercase tracking-widest">
                    Name
                  </th>
                  <th className="p-4 font-mono text-[10px] text-gray-400 font-normal uppercase tracking-widest">
                    Roll
                  </th>
                  <th className="p-4 font-mono text-[10px] text-gray-400 font-normal uppercase tracking-widest">
                    Operation
                  </th>
                  <th className="p-4 font-mono text-[10px] text-gray-400 font-normal uppercase tracking-widest">
                    Contact
                  </th>
                  <th className="p-4 font-mono text-[10px] text-gray-400 font-normal uppercase tracking-widest">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg, idx) => {
                  const user = usersMap[reg.userId] || {};
                  return (
                    <tr
                      key={reg.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4 font-mono text-xs text-brand-red opacity-80">
                        {String(idx + 1).padStart(3, "0")}
                      </td>
                      <td className="p-4">
                        <span className="font-display text-lg uppercase tracking-wider text-white group-hover:text-brand-gold transition-colors">
                          {user.name || "Unknown"}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-400">
                        {user.rollNumber || "N/A"}
                      </td>
                      <td className="p-4 font-mono text-sm text-brand-gold-bright tracking-wider">
                        {reg.eventName}
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-400">
                        {user.contact || "N/A"}
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-500 truncate max-w-[200px]">
                        {user.email || "N/A"}
                      </td>
                    </tr>
                  );
                })}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center font-mono text-sm text-gray-500 uppercase tracking-widest"
                    >
                      No operatives found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
