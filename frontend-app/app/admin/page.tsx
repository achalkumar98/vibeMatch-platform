"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Zap,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Ban,
  ShieldCheck,
  Loader2,
  IndianRupee,
  Activity,
  BadgeCheck,
  ShieldAlert,
} from "lucide-react";
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

/* ─── Metric card ─────────────────────────────────────────────────────────── */
function MetricCard({
  label,
  value,
  Icon,
  iconColor,
}: {
  label: string;
  value: string;
  Icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div
      className="glass-card p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}
          aria-hidden
        >
          <Icon size={15} style={{ color: iconColor }} strokeWidth={1.8} />
        </div>
      </div>
      <p
        className="text-2xl font-bold tracking-tight"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}

/* ─── Admin page ──────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const user   = useAppSelector((s) => s.user);
  const router = useRouter();

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [usersData, setUsersData] = useState<AdminUsersResponse | null>(null);
  const [search,    setSearch]    = useState("");
  const [page,      setPage]      = useState(1);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState<"overview" | "users">("overview");

  // Guard — redirect non-admins
  useEffect(() => {
    if (user !== null && !user.isAdmin) router.replace("/feed");
  }, [user, router]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await getAdminAnalyticsApi(30);
      setAnalytics(data);
    } catch {
      toast.error("Failed to load analytics.");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAdminUsersApi(page, 20, search);
      setUsersData(data);
    } catch {
      toast.error("Failed to load users.");
    }
  }, [page, search]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchAnalytics(), fetchUsers()]);
      setLoading(false);
    })();
  }, [fetchAnalytics, fetchUsers]);

  const handleRefresh = async () => {
    const id = toast.loading("Refreshing data…");
    await Promise.all([fetchAnalytics(), fetchUsers()]);
    toast.success("Dashboard refreshed.", { id });
  };

  const handleBan = async (userId: string, isBanned: boolean) => {
    const label = isBanned ? "Banning" : "Unbanning";
    const id    = toast.loading(`${label} user…`);
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
      toast.success(`User ${isBanned ? "banned" : "unbanned"} successfully.`, { id });
    } catch {
      toast.error("Action failed. Please try again.", { id });
    }
  };

  if (!user?.isAdmin) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", paddingTop: "56px" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--brand-subtle)", color: "var(--brand)" }}
              aria-hidden
            >
              <LayoutDashboard size={18} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                VibeMatch platform overview
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="vm-btn vm-btn-ghost text-xs px-3 py-1.5 self-start sm:self-auto"
            aria-label="Refresh dashboard data"
          >
            <RefreshCw size={13} strokeWidth={2} aria-hidden />
            Refresh
          </button>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div
          className="flex gap-1 mb-8 p-1 rounded-xl w-fit"
          style={{
            background: "var(--bg-overlay)",
            border:     "1px solid var(--border)",
          }}
          role="tablist"
          aria-label="Dashboard sections"
        >
          {([
            { key: "overview", label: "Overview", Icon: TrendingUp },
            { key: "users",    label: "Users",    Icon: Users },
          ] as const).map(({ key, label, Icon }) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: tab === key ? "var(--text-primary)" : "transparent",
                color:      tab === key ? "var(--bg-base)"      : "var(--text-muted)",
              }}
            >
              <Icon size={13} strokeWidth={1.8} aria-hidden />
              {label}
            </button>
          ))}
        </div>

        {/* ── Content ───────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2
              size={24}
              className="animate-spin"
              style={{ color: "var(--text-muted)" }}
              aria-label="Loading dashboard"
            />
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

/* ─── Overview Tab ────────────────────────────────────────────────────────── */
function OverviewTab({ analytics }: { analytics: AdminAnalytics | null }) {
  if (!analytics) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        No analytics data available.
      </p>
    );
  }

  const metrics = [
    {
      label: "Total Revenue",
      value: `₹${analytics.totalRevenue.toLocaleString("en-IN")}`,
      Icon:  IndianRupee,
      iconColor: "#22c55e",
    },
    {
      label: "Daily Active Users",
      value: analytics.dailyActiveUsers.toLocaleString(),
      Icon:  Activity,
      iconColor: "#6366f1",
    },
    {
      label: "Total Matches",
      value: analytics.totalMatches.toLocaleString(),
      Icon:  Zap,
      iconColor: "#f59e0b",
    },
  ];

  // Tick color depends on theme — use a neutral that works in both
  const tickProps = {
    fill:     "var(--text-muted)" as string,
    fontSize: 11 as number,
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* Revenue chart */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={15} style={{ color: "#22c55e" }} strokeWidth={1.8} aria-hidden />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Revenue — last 30 days
          </h3>
        </div>

        {analytics.revenueChart.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No revenue data yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics.revenueChart} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={tickProps}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: string) => v.slice(5)} // MM-DD
              />
              <YAxis
                tick={tickProps}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `₹${v}`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  background:   "var(--bg-surface)",
                  border:       "1px solid var(--border)",
                  borderRadius: "8px",
                  color:        "var(--text-primary)",
                  fontSize:     12,
                }}
                formatter={(val) => [`₹${val ?? 0}`, "Revenue"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#revGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#22c55e" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* DAU chart */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Activity size={15} style={{ color: "#6366f1" }} strokeWidth={1.8} aria-hidden />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Daily Active Users — last 30 days
          </h3>
        </div>

        {analytics.dauChart.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No activity data yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.dauChart} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={tickProps}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis tick={tickProps} axisLine={false} tickLine={false} width={36} />
              <Tooltip
                contentStyle={{
                  background:   "var(--bg-surface)",
                  border:       "1px solid var(--border)",
                  borderRadius: "8px",
                  color:        "var(--text-primary)",
                  fontSize:     12,
                }}
                formatter={(val) => [val ?? 0, "Active Users"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar
                dataKey="activeUsers"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

/* ─── Users Tab ───────────────────────────────────────────────────────────── */
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
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
            aria-hidden
          />
          <input
            type="search"
            className="vm-input pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            aria-label="Search users"
          />
        </div>
        {usersData && (
          <span className="vm-badge vm-badge-muted shrink-0">
            <Users size={11} strokeWidth={2} aria-hidden />
            {usersData.total.toLocaleString()} total users
          </span>
        )}
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
        role="table"
        aria-label="User management table"
      >
        {/* Header */}
        <div
          className="grid grid-cols-12 gap-2 px-4 py-2.5 text-2xs font-semibold uppercase tracking-widest"
          style={{
            background:   "var(--bg-overlay)",
            borderBottom: "1px solid var(--border)",
            color:        "var(--text-muted)",
          }}
          role="row"
        >
          <div className="col-span-4" role="columnheader">User</div>
          <div className="col-span-3 hidden md:block" role="columnheader">Email</div>
          <div className="col-span-2" role="columnheader">Status</div>
          <div className="col-span-2 hidden sm:block" role="columnheader">Last seen</div>
          <div className="col-span-3 md:col-span-1" role="columnheader">Action</div>
        </div>

        {/* Rows */}
        {!usersData || usersData.users.length === 0 ? (
          <div
            className="px-4 py-12 text-center text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            No users found.
          </div>
        ) : (
          usersData.users.map((u) => (
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
            className="vm-btn vm-btn-ghost text-xs px-3 py-1.5"
            aria-label="Previous page"
          >
            <ChevronLeft size={13} strokeWidth={2} aria-hidden />
            Prev
          </button>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Page {page} of {usersData.totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(usersData.totalPages, page + 1))}
            disabled={page === usersData.totalPages}
            className="vm-btn vm-btn-ghost text-xs px-3 py-1.5"
            aria-label="Next page"
          >
            Next
            <ChevronRight size={13} strokeWidth={2} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── UserRow ─────────────────────────────────────────────────────────────── */
function UserRow({
  user,
  onBan,
}: {
  user: AdminUser;
  onBan: (id: string, b: boolean) => void;
}) {
  const lastSeenLabel = (() => {
    if (!user.lastSeen) return "Never";
    const diff = Date.now() - new Date(user.lastSeen).getTime();
    const m    = Math.floor(diff / 60_000);
    if (m < 2)  return "Online";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  })();

  const isOnlineNow = user.lastSeen &&
    Date.now() - new Date(user.lastSeen).getTime() < 2 * 60_000;

  return (
    <div
      className="grid grid-cols-12 gap-2 px-4 py-3 items-center text-sm"
      style={{ borderBottom: "1px solid var(--border)" }}
      role="row"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-overlay)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {/* User info */}
      <div className="col-span-4 flex items-center gap-2.5 min-w-0" role="cell">
        <div
          className="w-8 h-8 rounded-full overflow-hidden shrink-0"
          style={{ border: "1px solid var(--border)" }}
        >
          {user.photoUrl ? (
            <Image
              src={user.photoUrl}
              alt={user.firstName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
            >
              {user.firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div
            className="text-xs font-semibold truncate flex items-center gap-1.5"
            style={{ color: "var(--text-primary)" }}
          >
            {user.firstName} {user.lastName}
            {user.isAdmin && (
              <BadgeCheck size={11} style={{ color: "var(--brand)", flexShrink: 0 }} aria-label="Admin" />
            )}
          </div>
          {user.isPremium && (
            <span
              className="text-2xs font-medium"
              style={{ color: "#f59e0b" }}
            >
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Email */}
      <div
        className="col-span-3 hidden md:block text-xs truncate"
        style={{ color: "var(--text-muted)" }}
        role="cell"
      >
        {user.emailId}
      </div>

      {/* Status badge */}
      <div className="col-span-2" role="cell">
        <span
          className={`vm-badge ${user.isBanned ? "vm-badge-error" : "vm-badge-success"}`}
        >
          {user.isBanned ? (
            <><ShieldAlert size={9} strokeWidth={2} aria-hidden /> Banned</>
          ) : (
            <><ShieldCheck size={9} strokeWidth={2} aria-hidden /> Active</>
          )}
        </span>
      </div>

      {/* Last seen */}
      <div
        className="col-span-2 hidden sm:block text-xs"
        style={{ color: isOnlineNow ? "var(--success)" : "var(--text-muted)" }}
        role="cell"
      >
        {lastSeenLabel}
      </div>

      {/* Ban / unban button */}
      <div className="col-span-3 md:col-span-1 flex items-center" role="cell">
        <button
          onClick={() => onBan(user._id, !user.isBanned)}
          className="vm-btn text-xs px-2.5 py-1 rounded-lg transition-colors"
          style={{
            color:      user.isBanned ? "var(--success)" : "var(--error)",
            background: "transparent",
            border:     "none",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = user.isBanned ? "var(--success-bg)" : "var(--error-bg)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
          aria-label={user.isBanned ? `Unban ${user.firstName}` : `Ban ${user.firstName}`}
        >
          {user.isBanned ? (
            <><ShieldCheck size={12} strokeWidth={2} aria-hidden /> Unban</>
          ) : (
            <><Ban size={12} strokeWidth={2} aria-hidden /> Ban</>
          )}
        </button>
      </div>
    </div>
  );
}
