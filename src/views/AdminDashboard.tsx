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
  RefreshCw,
  Ticket,
} from "lucide-react";
import Fuse from "fuse.js";
import { useAuth } from "../context/AuthContext";
import { onUsersSnapshot, updatePaymentStatus, type UserData } from "../lib/firebaseUtils";

interface AdminDashboardProps {
  onViewChange: (view: string) => void;
}

type UserWithId = UserData & { id: string };

export default function AdminDashboard({ onViewChange }: AdminDashboardProps) {
  const { setAdminSession } = useAuth();
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("ALL");
  const [filterPayment, setFilterPayment] = useState("ALL");
  const [updatingPayment, setUpdatingPayment] = useState<string | null>(null);

  // Real-time listener for all users
  useEffect(() => {
    const unsubscribe = onUsersSnapshot((allUsers) => {
      setUsers(allUsers);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fuse.js search
  const fuse = useMemo(
    () =>
      new Fuse(users, {
        keys: ["name", "studentId", "department", "contactNo", "hallName"],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [users]
  );

  // Filtered & searched results
  const filteredUsers = useMemo(() => {
    let result = users;

    // Search
    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map((r) => r.item);
    }

    // Filter by department
    if (filterDept !== "ALL") {
      result = result.filter((u) =>
        filterDept === "IPE" ? u.department === "IPE" : u.department !== "IPE"
      );
    }

    // Filter by payment status
    if (filterPayment !== "ALL") {
      result = result.filter((u) => u.paymentStatus === filterPayment);
    }

    return result;
  }, [users, searchQuery, filterDept, filterPayment, fuse]);

  // Stats
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

  const paymentBadge = (status: string) => {
    switch (status) {
      case "free":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-[10px] uppercase tracking-widest rounded-full">
            <CheckCircle size={10} /> Free
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-[10px] uppercase tracking-widest rounded-full">
            <CheckCircle size={10} /> Confirmed
          </span>
        );
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold-bright/10 border border-brand-gold-bright/30 text-brand-gold-bright font-mono text-[10px] uppercase tracking-widest rounded-full">
            <Clock size={10} /> Submitted
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] uppercase tracking-widest rounded-full">
            <XCircle size={10} /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-gray-500 font-mono text-[10px] uppercase tracking-widest rounded-full">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-body text-white">
      {/* Top bar */}
      <header className="bg-[#000]/90 backdrop-blur-xl border-b border-brand-red/30 px-4 md:px-10 h-16 flex items-center justify-between fixed top-0 w-full z-50">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-brand-red" />
          <h1 className="font-display text-xl md:text-2xl uppercase tracking-tighter text-brand-red hidden sm:block">
            Admin Dashboard
          </h1>
          <span className="bg-green-500/20 text-green-500 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-green-500/40 rounded-full hidden md:inline">
            Live
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 font-mono text-xs uppercase tracking-widest transition-all rounded-lg"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
          <StatCard icon={Users} label="Total Users" value={stats.total} color="text-white" />
          <StatCard icon={Shield} label="IPE" value={stats.ipe} color="text-brand-red" />
          <StatCard icon={Users} label="Others" value={stats.others} color="text-brand-gold-bright" />
          <StatCard icon={CheckCircle} label="Paid / Free" value={stats.paid} color="text-green-400" />
          <StatCard icon={Clock} label="Pending" value={stats.pending} color="text-red-400" />
        </div>

        {/* Search & Filters */}
        <div className="bg-[#111]/80 border border-white/10 rounded-xl p-4 md:p-5 mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
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

          {/* Department filter */}
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

          {/* Payment filter */}
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

        {/* Results count */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
            Showing {filteredUsers.length} of {users.length} operatives
          </p>
        </div>

        {/* Data table */}
        <div className="bg-[#111]/80 border border-white/10 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 size={24} className="animate-spin text-brand-red" />
              <span className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                Loading operatives...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40">
                    <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest w-12">
                      #
                    </th>
                    <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      Name
                    </th>
                    <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      Student ID
                    </th>
                    <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      Department
                    </th>
                    <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      Contact No
                    </th>
                    <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      Hall Name
                    </th>
                    <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      Payment
                    </th>
                    <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      Events
                    </th>
                    <th className="p-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest text-right">
                      Actions
                    </th>
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
                        {searchQuery || filterDept !== "ALL" || filterPayment !== "ALL"
                          ? "No operatives match your search criteria."
                          : "No registered operatives yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
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
    <div className="bg-[#111]/80 border border-white/10 rounded-xl p-4 md:p-5 flex items-center gap-3 hover:border-white/20 transition-colors">
      <div className={`p-2 bg-white/5 rounded-lg ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="font-display text-2xl md:text-3xl text-white">{value}</p>
        <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}
