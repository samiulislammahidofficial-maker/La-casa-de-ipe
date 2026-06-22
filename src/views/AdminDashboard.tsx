import { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Search,
  Filter,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
  ChevronDown,
  Loader2,
  Ticket,
  LayoutDashboard,
  BarChart2,
  Lock,
  Eye,
  Truck,
  Settings as SettingsIcon,
  HelpCircle,
  Download,
  AlertTriangle,
  Database,
  Building,
  Briefcase
} from "lucide-react";
import Fuse from "fuse.js";
import { useAuth } from "../context/AuthContext";
import { useMockState } from "../context/MockStateContext";
import { onUsersSnapshot, updatePaymentStatus, type UserData } from "../lib/firebaseUtils";
import CountdownTimer from "../components/CountdownTimer";
import heistBg from "../../picture/heist-bg.png";

interface AdminDashboardProps {
  onViewChange: (view: any) => void;
}

type UserWithId = UserData & { id: string };

type TabType =
  | "commandCenter"
  | "leaderboard"
  | "vault"
  | "intel"
  | "extraction"
  | "settings"
  | "support";

export default function AdminDashboard({ onViewChange }: AdminDashboardProps) {
  const { setAdminSession } = useAuth();
  const {
    pendingRequests,
    approveRegistration,
    rejectRegistration,
    registeredTeams
  } = useMockState();

  const [activeTab, setActiveTab] = useState<TabType>("commandCenter");
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("ALL");
  const [filterPayment, setFilterPayment] = useState("ALL");
  const [updatingPayment, setUpdatingPayment] = useState<string | null>(null);

  // Real-time listener for all users in Firestore
  useEffect(() => {
    const unsubscribe = onUsersSnapshot((allUsers) => {
      setUsers(allUsers);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fuse.js search setup for operatives database
  const fuse = useMemo(
    () =>
      new Fuse(users, {
        keys: ["name", "studentId", "department", "contactNo", "hallName"],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [users]
  );

  // Filtered & searched results for CommandCenter
  const filteredUsers = useMemo(() => {
    let result = users;

    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map((r) => r.item);
    }

    if (filterDept !== "ALL") {
      result = result.filter((u) =>
        filterDept === "IPE" ? u.department === "IPE" : u.department !== "IPE"
      );
    }

    if (filterPayment !== "ALL") {
      result = result.filter((u) => u.paymentStatus === filterPayment);
    }

    return result;
  }, [users, searchQuery, filterDept, filterPayment, fuse]);

  // Overall database stats
  const stats = useMemo(() => {
    const total = users.length;
    const ipe = users.filter((u) => u.department === "IPE").length;
    const others = total - ipe;
    const paid = users.filter(
      (u) => u.paymentStatus === "confirmed" || u.paymentStatus === "free"
    ).length;
    const pending = users.filter(
      (u) => u.paymentStatus === "pending" || u.paymentStatus === "submitted"
    ).length;
    return { total, ipe, others, paid, pending };
  }, [users]);

  // Total funds computation for the Vault
  const vaultLedger = useMemo(() => {
    const confirmedPaidOthers = users.filter(
      (u) => u.department !== "IPE" && u.paymentStatus === "confirmed"
    ).length;
    const submittedOthers = users.filter(
      (u) => u.department !== "IPE" && u.paymentStatus === "submitted"
    ).length;

    const collected = confirmedPaidOthers * 200;
    const inTransit = submittedOthers * 200;

    return {
      collected,
      inTransit,
      confirmedCount: confirmedPaidOthers,
      submittedCount: submittedOthers,
    };
  }, [users]);

  // Intel aggregates
  const intelStats = useMemo(() => {
    // Dept breakdown
    const depts: Record<string, number> = {};
    // Hall breakdown
    const halls: Record<string, number> = {};
    // Event registrations
    const events: Record<string, number> = {};

    users.forEach((u) => {
      const dept = u.department || "Unknown";
      depts[dept] = (depts[dept] || 0) + 1;

      const hall = u.hallName || "Unknown";
      halls[hall] = (halls[hall] || 0) + 1;

      if (u.registered_events) {
        u.registered_events.forEach((e) => {
          events[e] = (events[e] || 0) + 1;
        });
      }
    });

    const topDepts = Object.entries(depts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const topHalls = Object.entries(halls)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const topEvents = Object.entries(events)
      .sort((a, b) => b[1] - a[1]);

    return { topDepts, topHalls, topEvents };
  }, [users]);

  const handlePaymentUpdate = async (
    uid: string,
    status: "free" | "pending" | "submitted" | "confirmed"
  ) => {
    setUpdatingPayment(uid);
    try {
      await updatePaymentStatus(uid, status);
    } catch (err) {
      console.error("Failed to update payment:", err);
    }
    setUpdatingPayment(null);
  };

  const handleLogout = () => {
    setAdminSession(false);
    onViewChange("hub");
  };

  // Export JSON
  const exportToJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(users, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `lacasadeipe_operatives_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Student ID",
      "Email",
      "Department",
      "Contact No",
      "Hall Name",
      "Payment Status",
      "Registered Events",
    ];
    const rows = users.map((u) => [
      u.name,
      u.studentId,
      u.email,
      u.department,
      u.contactNo,
      u.hallName,
      u.paymentStatus,
      u.registered_events?.join("; ") || "",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((e) =>
        e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `lacasadeipe_operatives_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const paymentBadge = (status: string) => {
    switch (status) {
      case "free":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-[9px] uppercase tracking-widest rounded-full">
            <CheckCircle size={10} /> Free
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-[9px] uppercase tracking-widest rounded-full">
            <CheckCircle size={10} /> Confirmed
          </span>
        );
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-gold-bright/10 border border-brand-gold-bright/30 text-brand-gold-bright font-mono text-[9px] uppercase tracking-widest rounded-full animate-pulse">
            <Clock size={10} /> Submitted
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[9px] uppercase tracking-widest rounded-full">
            <XCircle size={10} /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 text-gray-500 font-mono text-[9px] uppercase tracking-widest rounded-full">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-body text-white flex">
      {/* ─── Premium Heist Sidebar ───────────────────────────────── */}
      <aside className="hidden md:flex flex-col h-full py-6 bg-[#0e0e0e]/95 backdrop-blur-2xl border-r border-white/10 fixed left-0 top-0 w-64 z-40 pt-20">
        {/* Profile / Hub Info */}
        <div className="px-6 mb-8 mt-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-red-light/30">
              <img
                src={heistBg}
                alt="La Casa De IPE Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-lg text-brand-red-light uppercase tracking-wider">
                Operative Hub
              </h2>
              <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                Status: Clandestine
              </p>
            </div>
          </div>

          <button
            onClick={() => onViewChange("hub")}
            className="w-full bg-brand-red hover:bg-red-800 text-white font-display text-sm uppercase py-2 px-4 rounded border border-red-950 transition-colors duration-300 mt-4 glow-red tracking-wider"
          >
            Terminal Access
          </button>
        </div>

        {/* Dynamic Navigation Tabs */}
        <nav className="flex-1 px-4 space-y-1">
          <SidebarTab
            active={activeTab === "commandCenter"}
            onClick={() => setActiveTab("commandCenter")}
            icon={LayoutDashboard}
            label="Command Center"
          />

          <SidebarTab
            active={activeTab === "leaderboard"}
            onClick={() => setActiveTab("leaderboard")}
            icon={BarChart2}
            label="Clearance"
            badgeCount={pendingRequests.length}
          />

          <SidebarTab
            active={activeTab === "vault"}
            onClick={() => setActiveTab("vault")}
            icon={Lock}
            label="Vault Ledger"
          />

          <SidebarTab
            active={activeTab === "intel"}
            onClick={() => setActiveTab("intel")}
            icon={Eye}
            label="System Intel"
          />

          <SidebarTab
            active={activeTab === "extraction"}
            onClick={() => setActiveTab("extraction")}
            icon={Truck}
            label="Extraction"
          />
        </nav>

        {/* Footer Links */}
        <div className="px-4 mt-auto mb-6 space-y-1">
          <SidebarTab
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            icon={SettingsIcon}
            label="Settings"
          />
          <SidebarTab
            active={activeTab === "support"}
            onClick={() => setActiveTab("support")}
            icon={HelpCircle}
            label="Support"
          />
        </div>
      </aside>

      {/* ─── Main Content Container ────────────────────────────── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-[#000]/90 backdrop-blur-xl border-b border-brand-red/30 px-6 md:px-10 h-16 flex items-center justify-between fixed top-0 left-0 md:left-64 right-0 z-50">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-brand-red" />
            <h1 className="font-display text-xl uppercase tracking-tighter text-brand-red">
              ROYAL MINT PROTOCOL - ADMIN
            </h1>
            <span className="bg-red-500/20 text-brand-red-light px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-widest border border-brand-red/40 rounded-full">
              Live Database Mode
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 font-mono text-xs uppercase tracking-widest transition-all rounded-lg border border-transparent hover:border-white/10"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Exit Session</span>
          </button>
        </header>

        {/* Inside Main View */}
        <main className="pt-24 pb-12 px-4 md:px-8 max-w-[1400px] w-full mx-auto flex-1">
          {/* Global Countdown Timer */}
          <div className="mb-8">
            <CountdownTimer targetDate="2026-12-31T00:00:00Z" />
          </div>

          {/* ────────────────── Active Tab Displays ────────────────── */}

          {/* 1. Command Center Tab */}
          {activeTab === "commandCenter" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                <StatCard icon={Users} label="Total Users" value={stats.total} color="text-white" />
                <StatCard icon={Shield} label="IPE Operatives" value={stats.ipe} color="text-brand-red-light" />
                <StatCard icon={Users} label="Others" value={stats.others} color="text-brand-gold-bright" />
                <StatCard icon={CheckCircle} label="Paid/Free" value={stats.paid} color="text-green-400" />
                <StatCard icon={Clock} label="Pending clearance" value={stats.pending} color="text-red-400" />
              </div>

              {/* Filtering Controls */}
              <div className="bg-[#111]/80 border border-white/10 rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-red/50 outline-none rounded-lg pl-11 pr-4 py-3 text-white font-mono text-sm transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="relative">
                  <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="bg-black/40 border border-white/10 text-white font-mono text-xs uppercase tracking-widest pl-9 pr-8 py-3 rounded-lg outline-none appearance-none cursor-pointer hover:border-white/25 transition-colors min-w-[140px]"
                  >
                    <option value="ALL">All Depts</option>
                    <option value="IPE">IPE Only</option>
                    <option value="OTHERS">Others Only</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <div className="relative">
                  <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                    className="bg-black/40 border border-white/10 text-white font-mono text-xs uppercase tracking-widest pl-9 pr-8 py-3 rounded-lg outline-none appearance-none cursor-pointer hover:border-white/25 transition-colors min-w-[160px]"
                  >
                    <option value="ALL">All Payment</option>
                    <option value="free">Free</option>
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-[#111]/80 border border-white/10 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                {loading ? (
                  <div className="flex items-center justify-center py-20 gap-3">
                    <Loader2 size={24} className="animate-spin text-brand-red" />
                    <span className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                      Syncing Firestore...
                    </span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                      <thead>
                        <tr className="border-b border-white/10 bg-black/40">
                          <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest w-12">#</th>
                          <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">Name</th>
                          <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">Student ID</th>
                          <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">Department</th>
                          <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">Contact No</th>
                          <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">Hall Name</th>
                          <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">Payment</th>
                          <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">Events</th>
                          <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, idx) => (
                          <tr
                            key={user.id}
                            className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                          >
                            <td className="p-4 font-mono text-xs text-gray-600">
                              {String(idx + 1).padStart(3, "0")}
                            </td>
                            <td className="p-4">
                              <span className="font-mono text-sm text-white group-hover:text-brand-gold-bright transition-colors">
                                {user.name || "—"}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-sm text-gray-300">
                              {user.studentId || "—"}
                            </td>
                            <td className="p-4">
                              <span
                                className={`font-mono text-xs uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                  user.department === "IPE"
                                    ? "bg-brand-red/10 border-brand-red/30 text-brand-red-light"
                                    : "bg-brand-gold-bright/10 border-brand-gold-bright/30 text-brand-gold-bright"
                                }`}
                              >
                                {user.department || "—"}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-xs text-gray-400">
                              {user.contactNo || "—"}
                            </td>
                            <td className="p-4 font-mono text-xs text-gray-400">
                              {user.hallName || "—"}
                            </td>
                            <td className="p-4">{paymentBadge(user.paymentStatus)}</td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {user.registered_events && user.registered_events.length > 0 ? (
                                  user.registered_events.map((evt) => (
                                    <span
                                      key={evt}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 border border-white/10 text-gray-400 font-mono text-[9px] uppercase tracking-wider rounded"
                                    >
                                      <Ticket size={8} />
                                      {evt}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-600 font-mono text-[10px]">None</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              {user.paymentStatus === "submitted" && (
                                <button
                                  onClick={() => handlePaymentUpdate(user.id, "confirmed")}
                                  disabled={updatingPayment === user.id}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/30 rounded-lg transition-all font-mono text-[10px] uppercase tracking-widest disabled:opacity-50"
                                >
                                  {updatingPayment === user.id ? (
                                    <Loader2 size={10} className="animate-spin" />
                                  ) : (
                                    <CheckCircle size={10} />
                                  )}
                                  Confirm
                                </button>
                              )}
                              {user.paymentStatus === "pending" && (
                                <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
                                  Awaiting payment
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td
                              colSpan={9}
                              className="p-16 text-center font-mono text-sm text-gray-600 uppercase tracking-widest"
                            >
                              No operatives match your search criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Clearance (Leaderboard) Tab */}
          {activeTab === "leaderboard" && (
            <div className="space-y-6">
              <div className="bg-[#151515]/85 border border-brand-gold-bright/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(233,195,73,0.1)]">
                <div className="px-6 py-5 border-b border-brand-gold-bright/20 flex items-center justify-between bg-[#1a1a1a]">
                  <div>
                    <h3 className="font-display text-2xl text-white uppercase tracking-wide flex items-center gap-2">
                      Clearance Registrations
                      {pendingRequests.length > 0 && (
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold-bright opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-gold-bright"></span>
                        </span>
                      )}
                    </h3>
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-1">
                      Awaiting clearance: {pendingRequests.length}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-white/5 bg-black/40">
                        <th className="p-4 font-mono text-[10px] text-gray-600 uppercase tracking-widest w-12">#</th>
                        <th className="p-4 font-mono text-[10px] text-gray-400 uppercase tracking-widest">Operative Target</th>
                        <th className="p-4 font-mono text-[10px] text-gray-400 uppercase tracking-widest">Operation Name</th>
                        <th className="p-4 font-mono text-[10px] text-gray-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((eventName, idx) => {
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
                                    Leader ID: {team.leaderUid} | Teammates: {team.teammateUids.join(", ")}
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
                                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/30 rounded transition-all font-mono text-xs uppercase tracking-widest"
                              >
                                <CheckCircle size={14} />
                                Approve
                              </button>
                              <button
                                onClick={() => rejectRegistration(eventName)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 rounded transition-all font-mono text-xs uppercase tracking-widest"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {pendingRequests.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-16 text-center font-mono text-sm text-gray-500 uppercase tracking-widest"
                          >
                            No clearance requests. Vault is secure.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. Vault Ledger Tab */}
          {activeTab === "vault" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ledger summary */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute right-2 bottom-2 text-white/[0.02]">
                    <Lock size={120} />
                  </div>
                  <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">
                    Total Funds Secured
                  </h3>
                  <p className="font-display text-4xl md:text-5xl text-green-400">
                    ৳{vaultLedger.collected.toLocaleString()}
                  </p>
                  <p className="font-mono text-[10px] text-gray-400 mt-2">
                    Secured from {vaultLedger.confirmedCount} confirmed other registrations.
                  </p>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute right-2 bottom-2 text-white/[0.02]">
                    <Clock size={120} />
                  </div>
                  <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">
                    Funds In Transit
                  </h3>
                  <p className="font-display text-4xl md:text-5xl text-brand-gold-bright">
                    ৳{vaultLedger.inTransit.toLocaleString()}
                  </p>
                  <p className="font-mono text-[10px] text-gray-400 mt-2">
                    Awaiting clearance from {vaultLedger.submittedCount} submitted receipts.
                  </p>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute right-2 bottom-2 text-white/[0.02]">
                    <Shield size={120} />
                  </div>
                  <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">
                    IPE Free Allocations
                  </h3>
                  <p className="font-display text-4xl md:text-5xl text-brand-red-light">
                    {stats.ipe}
                  </p>
                  <p className="font-mono text-[10px] text-gray-400 mt-2">
                    Validated free entries for IPE department operatives.
                  </p>
                </div>
              </div>

              {/* Secure Vault Status Screen */}
              <div className="bg-[#151515]/85 border border-brand-red/20 rounded-xl p-8 text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 mx-auto bg-brand-red/10 border border-brand-red/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,0,0,0.2)] animate-pulse">
                  <Lock size={32} className="text-brand-red" />
                </div>
                <h4 className="font-display text-2xl uppercase tracking-wider mb-2">
                  Vault Security Protocol
                </h4>
                <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">
                  Vault: Safe & Encrypted
                </p>
                <div className="bg-black/60 rounded-lg p-5 border border-white/5 text-left font-mono text-xs text-gray-400 space-y-2">
                  <div className="flex justify-between">
                    <span>LEDGER ENCRYPTION:</span>
                    <span className="text-green-400">AES-256 ENABLED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DATABASE PROVIDER:</span>
                    <span className="text-brand-red-light">FIRESTORE CLOUD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LAST INTEGRITY CHECK:</span>
                    <span className="text-white">SECURE (AUTO-CHECK)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. System Intel Tab */}
          {activeTab === "intel" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department distribution */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                  <h3 className="font-display text-lg uppercase tracking-wider mb-4 flex items-center gap-2 text-brand-gold-bright">
                    <Briefcase size={16} /> Top Departments
                  </h3>
                  <div className="space-y-4 font-mono text-xs">
                    {intelStats.topDepts.map(([name, count]) => (
                      <div key={name} className="space-y-1">
                        <div className="flex justify-between text-gray-300">
                          <span>{name}</span>
                          <span className="font-bold text-white">{count}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-red"
                            style={{
                              width: `${(count / stats.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hall distribution */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                  <h3 className="font-display text-lg uppercase tracking-wider mb-4 flex items-center gap-2 text-brand-gold-bright">
                    <Building size={16} /> Hall Allocations
                  </h3>
                  <div className="space-y-4 font-mono text-xs">
                    {intelStats.topHalls.map(([name, count]) => (
                      <div key={name} className="space-y-1">
                        <div className="flex justify-between text-gray-300">
                          <span>{name}</span>
                          <span className="font-bold text-white">{count}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-gold"
                            style={{
                              width: `${(count / stats.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Event Registrations */}
              <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                <h3 className="font-display text-lg uppercase tracking-wider mb-4 flex items-center gap-2 text-brand-gold-bright">
                  <Ticket size={16} /> Operation Event Distribution
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
                  {intelStats.topEvents.map(([name, count]) => (
                    <div
                      key={name}
                      className="bg-black/40 border border-white/5 rounded-lg p-4 flex justify-between items-center"
                    >
                      <span className="text-gray-400">{name}</span>
                      <span className="text-brand-gold-bright font-bold bg-brand-gold/10 border border-brand-gold/20 px-2 py-0.5 rounded">
                        {count} regs
                      </span>
                    </div>
                  ))}
                  {intelStats.topEvents.length === 0 && (
                    <p className="text-gray-600 py-4 col-span-3 text-center">
                      No events registered.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. Extraction Tab */}
          {activeTab === "extraction" && (
            <div className="space-y-6 max-w-2xl mx-auto text-center py-10">
              <div className="w-20 h-20 mx-auto bg-brand-gold-bright/10 border border-brand-gold-bright/30 rounded-full flex items-center justify-center mb-6">
                <Truck size={36} className="text-brand-gold-bright" />
              </div>
              <h3 className="font-display text-3xl uppercase tracking-wider mb-3">
                Operative Data Extraction
              </h3>
              <p className="font-mono text-xs text-gray-400 leading-relaxed mb-10 max-w-md mx-auto">
                Export and download full local profile datasets. All extractions are encoded in real-time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={exportToCSV}
                  className="flex items-center justify-center gap-3 py-4 bg-brand-gold-bright hover:bg-yellow-500 text-black font-display text-lg uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(233,195,73,0.15)] transition-all cursor-pointer"
                >
                  <Download size={20} />
                  Extract CSV format
                </button>

                <button
                  onClick={exportToJSON}
                  className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-mono text-sm uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  <Download size={18} />
                  Extract JSON format
                </button>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 mt-12 text-left">
                <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <Database size={10} /> Database statistics
                </p>
                <p className="font-mono text-xs text-gray-400">
                  Total record size: <strong className="text-white">{users.length}</strong> operative entries.
                </p>
              </div>
            </div>
          )}

          {/* 6. Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                <h3 className="font-display text-xl uppercase tracking-wider mb-6 pb-2 border-b border-white/10">
                  Operational Settings
                </h3>

                <div className="space-y-6 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold mb-1">Registration Gate</p>
                      <p className="text-gray-500 text-[10px]">Controls whether new user registrations are permitted.</p>
                    </div>
                    <span className="text-green-500 border border-green-500/20 bg-green-500/10 px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest">
                      GATE OPEN
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold mb-1">Database Sync Speed</p>
                      <p className="text-gray-500 text-[10px]">Live listener snap frequency interval.</p>
                    </div>
                    <span className="text-brand-gold-bright border border-brand-gold/20 bg-brand-gold/10 px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest">
                      REALTIME ON
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold mb-1">Theme Config</p>
                      <p className="text-gray-500 text-[10px]">Portal styling mode toggle.</p>
                    </div>
                    <span className="text-brand-red-light border border-brand-red/20 bg-brand-red/10 px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest">
                      ROYAL MINT DEFAULT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. Support Tab */}
          {activeTab === "support" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                <h3 className="font-display text-xl uppercase tracking-wider mb-6 pb-2 border-b border-white/10">
                  Command Support Terminal
                </h3>

                <div className="font-mono text-xs text-gray-300 space-y-4 leading-relaxed">
                  <p>
                    Welcome to the **Royal Mint Protocol Admin Console**. This dashboard enables authorized command personnel to perform live oversight of the operative pool.
                  </p>
                  <h4 className="text-brand-gold-bright uppercase tracking-wider font-bold mt-4 mb-2">
                    Oversight Procedures
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>
                      <strong className="text-white">Command Center:</strong> Review demographic listings. Click the "Confirm" action to clearance a manual fee submission.
                    </li>
                    <li>
                      <strong className="text-white">Clearance:</strong> Reviews and approves game-state registrations. These represent interactive team-building clearances.
                    </li>
                    <li>
                      <strong className="text-white">Vault Ledger:</strong> Tallies secured registration funds based on validated entries.
                    </li>
                    <li>
                      <strong className="text-white">Extraction:</strong> Pull down data offline. Supports CSV spreadsheets and JSON files.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Stat Card Sub-component ──────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-[#111]/85 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-white/20 transition-all hover:scale-[1.02]">
      <div className={`p-2 bg-white/5 rounded-lg ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="font-display text-2xl md:text-3xl text-white">{value}</p>
        <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── Sidebar Navigation Tab Button ──────────────────────
function SidebarTab({
  active,
  onClick,
  icon: Icon,
  label,
  badgeCount,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
  badgeCount?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer ${
        active
          ? "text-brand-red-light bg-brand-red/10 border-r-2 border-brand-red font-bold"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="px-2 py-0.5 text-[9px] bg-brand-gold-bright text-black font-bold font-mono rounded">
          {badgeCount}
        </span>
      )}
    </button>
  );
}
