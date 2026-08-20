"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { getAdminAnalyticsApi, getAdminUsersApi, banUserApi } from "@/api/adminApi";
import type { AdminAnalytics, AdminUser, AdminUsersResponse } from "@/types";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [usersData, setUsersData] = useState<AdminUsersResponse | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "users">("overview");

  // Guard — redirect non-admins
  useEffect(() => {
    if (user !== null && !user.isAdmin) {
      router.replace("/feed");
    }
  }, [user, router]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await getAdminAnalyticsApi(30);
      setAnalytics(data);
    } catch (err) {
      console.error("Analytics error:", err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAdminUsersApi(page, 20, search);
      setUsersData(data);
    } catch (err) {
      console.error("Users error:", err);
    }
  }, [page, search]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchAnalytics(), fetchUsers()]);
      setLoading(false);
    })();
  }, [fetchAnalytics, fetchUsers]);

  const handleBan = async (userId: string, isBanned: boolean) => {
    try {
      await banUserApi(userId, isBanned);
      setUsersData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u._id === userId ? { ...u, isBanned } : u
          ),
        };
      });
    } catch (err) {
      console.error("Ban error:", err);
    }
  };

  if (!user?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-black" style={{ paddingTop: "56px" }}>
      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-white/35 mt-1">VibeMatch platform overview</p>
          </div>
          <button
            onClick={() => { fetchAnalytics(); fetchUsers(); }}
            className="vm-btn vm-btn-ghost text-xs px-3 py-1.5"
          >
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 mb-8 p-1 rounded-xl w-fit"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {(["overview", "users"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                tab === t ? "bg-white text-black font-medium" : "text-white/50 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : tab === "overview" ? (
          <OverviewTab analytics={analytics} />
        ) : (
          <UsersTab
            usersData={usersData}
            search={search}
            setSearch={setSearch}
            page={page}
            setPage={setPage}
            onBan={handleBan}
          />
        )}
      </div>
    </div>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ analytics }: { analytics: AdminAnalytics | null }) {
  if (!analytics) return <p className="text-white/30 text-sm">No data available.</p>;

  const metrics = [
    { label: "Total Revenue", value: `₹${analytics.totalRevenue.toLocaleString()}`, icon: "💰", color: "#22c55e" },
    { label: "Daily Active Users", value: analytics.dailyActiveUsers.toString(), icon: "👥", color: "#6366f1" },
    { label: "Total Matches", value: analytics.totalMatches.toString(), icon: "⚡", color: "#f59e0b" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/35 uppercase tracking-wider font-medium">{m.label}</span>
              <span className="text-lg">{m.icon}</span>
            </div>
            <div className="text-2xl font-bold text-white">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-medium text-white mb-5">Revenue (last 30 days)</h3>
        {analytics.revenueChart.length === 0 ? (
          <p className="text-white/20 text-sm">No revenue data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics.revenueChart}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: 12 }}
                formatter={(val) => [`₹${val ?? 0}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* DAU chart */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-medium text-white mb-5">Daily Active Users (last 30 days)</h3>
        {analytics.dauChart.length === 0 ? (
          <p className="text-white/20 text-sm">No activity data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.dauChart}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: 12 }}
                formatter={(val) => [val ?? 0, "Active Users"]}
              />
              <Bar dataKey="activeUsers" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────

function UsersTab({
  usersData,
  search,
  setSearch,
  page,
  setPage,
  onBan,
}: {
  usersData: AdminUsersResponse | null;
  search: string;
  setSearch: (s: string) => void;
  page: number;
  setPage: (p: number) => void;
  onBan: (userId: string, isBanned: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          className="vm-input max-w-xs"
          placeholder="Search users…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        {usersData && (
          <span className="text-sm text-white/30">{usersData.total} total users</span>
        )}
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-12 gap-2 px-4 py-2.5 text-xs text-white/30 uppercase tracking-wider font-medium"
          style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="col-span-4">User</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Last seen</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Rows */}
        {usersData?.users.length === 0 ? (
          <div className="px-4 py-10 text-center text-white/20 text-sm">No users found.</div>
        ) : (
          usersData?.users.map((u: AdminUser) => (
            <UserRow key={u._id} user={u} onBan={onBan} />
          ))
        )}
      </div>

      {/* Pagination */}
      {usersData && usersData.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="vm-btn vm-btn-ghost text-xs px-3 py-1.5 disabled:opacity-30"
          >
            ← Prev
          </button>
          <span className="text-xs text-white/30">
            Page {page} / {usersData.totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(usersData.totalPages, page + 1))}
            disabled={page === usersData.totalPages}
            className="vm-btn vm-btn-ghost text-xs px-3 py-1.5 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function UserRow({ user, onBan }: { user: AdminUser; onBan: (id: string, b: boolean) => void }) {
  const lastSeen = user.lastSeen
    ? (() => {
        const diff = Date.now() - new Date(user.lastSeen).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 2) return "Online";
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        return `${Math.floor(h / 24)}d ago`;
      })()
    : "Never";

  return (
    <div
      className="grid grid-cols-12 gap-2 px-4 py-3 items-center text-sm"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* User */}
      <div className="col-span-4 flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-white/10">
          {user.photoUrl && (
            <Image
              src={user.photoUrl}
              alt={user.firstName}
              width={28}
              height={28}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <div className="text-white text-xs font-medium truncate">
            {user.firstName} {user.lastName}
            {user.isAdmin && <span className="ml-1 text-indigo-400">Admin</span>}
          </div>
          {user.isPremium && <span className="text-xs text-yellow-400/70">Premium</span>}
        </div>
      </div>

      {/* Email */}
      <div className="col-span-2 text-xs text-white/35 truncate">{user.emailId}</div>

      {/* Status */}
      <div className="col-span-2">
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            background: user.isBanned ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
            color: user.isBanned ? "#f87171" : "#86efac",
          }}
        >
          {user.isBanned ? "Banned" : "Active"}
        </span>
      </div>

      {/* Last seen */}
      <div className="col-span-2 text-xs text-white/30">{lastSeen}</div>

      {/* Actions */}
      <div className="col-span-2 flex items-center gap-1">
        <button
          onClick={() => onBan(user._id, !user.isBanned)}
          className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
            user.isBanned
              ? "text-green-400 hover:bg-green-500/10"
              : "text-red-400 hover:bg-red-500/10"
          }`}
        >
          {user.isBanned ? "Unban" : "Ban"}
        </button>
      </div>
    </div>
  );
}
