"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { MessageSquare, Search, Users, Loader2, Circle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addConnections } from "@/redux/slices/connectionSlice";
import { getConnectionsApi } from "@/api/connectionApi";

function formatLastSeen(lastSeen?: string | null): string {
  if (!lastSeen) return "Offline";
  const diff = Date.now() - new Date(lastSeen).getTime();
  const m    = Math.floor(diff / 60_000);
  if (m < 2)  return "Online";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function isOnline(lastSeen?: string | null): boolean {
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < 2 * 60_000;
}

export default function ConnectionsPage() {
  const connections = useAppSelector((s) => s.connections);
  const dispatch    = useAppDispatch();
  const [loading,   setLoading] = useState(true);
  const [search,    setSearch]  = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getConnectionsApi();
        dispatch(addConnections(data));
      } catch (err) {
        console.error("Failed to fetch connections:", err);
        toast.error("Could not load connections. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const filtered = (connections ?? []).filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", paddingTop: "56px" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Users size={20} style={{ color: "var(--brand)" }} strokeWidth={1.8} aria-hidden />
            <h1 className="page-title">Connections</h1>
          </div>
          {connections && (
            <span className="vm-badge vm-badge-muted">
              {connections.length} total
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
            aria-hidden
          />
          <input
            type="search"
            className="vm-input"
            style={{ paddingLeft: "2.25rem" }}
            placeholder="Search connections…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search connections"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={22} className="animate-spin" style={{ color: "var(--text-muted)" }} aria-label="Loading" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users size={40} className="mx-auto mb-4" style={{ color: "var(--border-strong)" }} aria-hidden />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {search
                ? "No connections match your search."
                : "No connections yet. Start swiping in the feed!"}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2" role="list">
            {filtered.map(({ _id, firstName, lastName, photoUrl, age, gender, about, lastSeen }) => {
              const online = isOnline(lastSeen);
              return (
                <li
                  key={_id}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors"
                  style={{ border: "1px solid var(--border)", background: "var(--bg-surface)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                >
                  {/* Avatar + online dot */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden">
                      <Image
                        src={photoUrl || "https://www.gravatar.com/avatar?d=mp"}
                        alt={`${firstName}'s avatar`}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Circle
                      size={10}
                      className="absolute bottom-0 right-0 fill-current"
                      style={{
                        color:      online ? "var(--success)" : "var(--text-disabled)",
                        stroke:     "var(--bg-base)",
                        strokeWidth: 2,
                      }}
                      aria-hidden
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {firstName} {lastName}
                      </span>
                      {age && gender && (
                        <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                          {age} · {gender}
                        </span>
                      )}
                    </div>
                    {about && (
                      <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{about}</p>
                    )}
                    <p
                      className="text-xs mt-0.5 font-medium"
                      style={{ color: online ? "var(--success)" : "var(--text-disabled)" }}
                    >
                      {formatLastSeen(lastSeen)}
                    </p>
                  </div>

                  {/* Message button */}
                  <Link href={`/chat/${_id}`} className="shrink-0" aria-label={`Message ${firstName}`}>
                    <button className="vm-btn vm-btn-ghost text-xs px-3 py-1.5">
                      <MessageSquare size={13} strokeWidth={1.8} aria-hidden />
                      <span className="hidden sm:inline">Message</span>
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
