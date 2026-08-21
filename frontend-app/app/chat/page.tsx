"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { MessageSquare, Search, Loader2, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addConnections } from "@/redux/slices/connectionSlice";
import { getConnectionsApi } from "@/api/connectionApi";

const NEUTRAL_AVATAR = (seed: string) =>
  `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

function isOnline(lastSeen?: string | null): boolean {
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < 2 * 60_000;
}

function formatLastSeen(lastSeen?: string | null): string {
  if (!lastSeen) return "Offline";
  const diff = Date.now() - new Date(lastSeen).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 2)  return "Online";
  if (m < 60) return `Active ${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Active ${h}h ago`;
  return `Active ${Math.floor(h / 24)}d ago`;
}

export default function ChatIndexPage() {
  const connections = useAppSelector((s) => s.connections);
  const dispatch    = useAppDispatch();
  const [loading, setLoading] = useState(!connections);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    if (connections) return;
    (async () => {
      try {
        const data = await getConnectionsApi();
        dispatch(addConnections(data));
      } catch {
        toast.error("Could not load connections.");
      } finally {
        setLoading(false);
      }
    })();
  }, [connections, dispatch]);

  const filtered = (connections ?? []).filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", paddingTop: "60px" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--brand-subtle)", color: "var(--brand)" }}
          >
            <MessageSquare size={17} strokeWidth={1.8} aria-hidden />
          </div>
          <div>
            <h1 className="page-title">Messages</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Chat with your connections
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
            aria-hidden
          />
          <input
            type="search"
            className="vm-input pl-9"
            placeholder="Search conversations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search conversations"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={22} className="animate-spin" style={{ color: "var(--text-muted)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users size={40} className="mx-auto mb-4" style={{ color: "var(--border-strong)" }} aria-hidden />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {search ? "No conversations match your search." : "No connections yet. Start swiping in the feed!"}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1" role="list">
            {filtered.map((c) => {
              const online = isOnline(c.lastSeen);
              const avatar = c.photoUrl || NEUTRAL_AVATAR(`${c.firstName}${c.lastName}`);
              return (
                <li key={c._id}>
                  <Link
                    href={`/chat/${c._id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                    style={{ background: "transparent", border: "1px solid var(--border)" }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background   = "var(--bg-surface)";
                      el.style.borderColor  = "var(--border-strong)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background  = "transparent";
                      el.style.borderColor = "var(--border)";
                    }}
                  >
                    {/* Avatar + online dot */}
                    <div className="relative shrink-0">
                      <div
                        className="w-11 h-11 rounded-full overflow-hidden"
                        style={{ border: "2px solid var(--border-strong)" }}
                      >
                        <Image
                          src={avatar}
                          alt={`${c.firstName}'s avatar`}
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
                        style={{
                          background: online ? "var(--success)" : "var(--text-disabled)",
                          border:     "2px solid var(--bg-base)",
                        }}
                        aria-hidden
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {c.firstName} {c.lastName}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: online ? "var(--success)" : "var(--text-muted)" }}
                      >
                        {formatLastSeen(c.lastSeen)}
                      </p>
                    </div>

                    {/* Chat icon */}
                    <div
                      className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "var(--brand-subtle)", color: "var(--brand)" }}
                    >
                      <MessageSquare size={14} strokeWidth={1.8} aria-hidden />
                    </div>
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
