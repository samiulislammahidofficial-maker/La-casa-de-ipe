import { useState } from "react";
import {
  Bell,
  Terminal,
  ShieldCheck,
  XCircle,
  Filter,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import CountdownTimer from "../components/CountdownTimer";
import { useMockState } from "../context/MockStateContext";
import { ViewType } from "../App";

interface DashboardViewProps {
  onViewChange: (view: ViewType) => void;
}

export default function DashboardView({ onViewChange }: DashboardViewProps) {
  const { pendingRequests, approveRegistration, rejectRegistration, registeredTeams } = useMockState();
  const [filterEvent, setFilterEvent] = useState<string>("ALL");

  const uniqueEvents = Array.from(
    new Set([...pendingRequests]),
  ).sort();

  const filteredRegistrations =
    filterEvent === "ALL"
      ? pendingRequests
      : pendingRequests.filter((r) => r === filterEvent);

  return (
    <div className="min-h-screen bg-[#111] font-body">
      <header className="hidden md:flex bg-[#000]/80 backdrop-blur-xl border-b border-brand-red/30 justify-between items-center px-10 h-16 fixed top-0 w-full z-50">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-2xl uppercase tracking-tighter text-brand-red">
            ROYAL MINT PROTOCOL - ADMIN
          </h1>
          <span className="bg-green-500/20 text-green-500 px-2 py-0.5 text-xs font-mono uppercase tracking-widest border border-green-500/50 rounded">
            Unrestricted Mock Mode
          </span>
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

        <section className="bg-[#151515]/80 backdrop-blur-xl border border-brand-gold-bright/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(233,195,73,0.1)] glow-gold">
          <div className="px-6 py-5 border-b border-brand-gold-bright/20 flex flex-col items-start gap-4 md:flex-row md:items-center justify-between bg-[#1a1a1a]">
            <div>
              <h3 className="font-display text-2xl text-white uppercase tracking-wide flex items-center gap-2">
                Pending Registrations
                {pendingRequests.length > 0 && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold-bright opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-gold-bright"></span>
                  </span>
                )}
              </h3>
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-1">
                Awaiting Clearance: {filteredRegistrations.length}
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
                    Operative Target
                  </th>
                  <th className="p-4 font-mono text-[10px] text-gray-400 font-normal uppercase tracking-widest">
                    Operation Name
                  </th>
                  <th className="p-4 font-mono text-[10px] text-gray-400 font-normal uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((eventName, idx) => {
                  const team = registeredTeams[eventName];
                  return (
                    <tr
                      key={`${eventName}-${idx}`}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4 font-mono text-xs text-brand-gold-bright opacity-80">
                        {String(idx + 1).padStart(3, "0")}
                      </td>
                      <td className="p-4">
                        {team ? (
                          <div className="flex flex-col">
                            <span className="font-display text-lg uppercase tracking-wider text-white group-hover:text-brand-gold transition-colors">
                              Team: {team.teamName}
                            </span>
                            <span className="font-mono text-xs text-gray-500 mt-0.5">
                              Leader ID: {team.leaderUid} | Teammate IDs: {team.teammateUids.join(", ")}
                            </span>
                          </div>
                        ) : (
                          <span className="font-display text-lg uppercase tracking-wider text-white group-hover:text-brand-gold transition-colors">
                            Operative Alpha
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-sm text-brand-gold-bright tracking-wider">
                        {eventName}
                      </td>
                      <td className="p-4 flex justify-end gap-3">
                        <button 
                          onClick={() => approveRegistration(eventName)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/30 rounded transition-all font-mono text-xs uppercase tracking-widest"
                        >
                          <ShieldCheck size={14} />
                          Approve
                        </button>
                        <button 
                          onClick={() => rejectRegistration(eventName)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 rounded transition-all font-mono text-xs uppercase tracking-widest"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-12 text-center font-mono text-sm text-gray-500 uppercase tracking-widest"
                    >
                      No pending requests. Vault is secure.
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
