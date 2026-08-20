"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addConnections } from "@/redux/slices/connectionSlice";
import { getConnectionsApi } from "@/api/connectionApi";

function formatLastSeen(lastSeen: string | null | undefined): string {
  if (!lastSeen) return "Offline";
  const diff = Date.now() - new Date(lastSeen).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 2) return "Online";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function isOnline(lastSeen: string | null | undefined): boolean {
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < 2 * 60 * 1000;
}

export default function ConnectionsPage() {
  const connections = useAppSelector((state) => state.connections);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getConnectionsApi();
        dispatch(addConnections(data));
      } catch (err) {
        console.error("Failed to fetch connections:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const filtered = (connections ?? []).filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black" style={{ paddingTop: "56px" }}>
      <div className="max-w-3xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Connections</h1>
          {connections && (
            <span className="text-sm text-white/30">{connections.length} total</span>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          className="vm-input mb-6"
          placeholder="Search connections…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-white/40 text-sm">
              {search ? "No connections match your search." : "No connections yet. Start swiping in the feed!"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(({ _id, firstName, lastName, photoUrl, age, gender, about, lastSeen }) => (
              <div
                key={_id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors hover:bg-white/3"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Avatar with online dot */}
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden">
                    <Image
                      src={photoUrl || "https://www.gravatar.com/avatar?d=mp"}
                      alt={`${firstName}'s avatar`}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black"
                    style={{ background: isOnline(lastSeen) ? "#22c55e" : "#555" }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">
                      {firstName} {lastName}
                    </span>
                    {age && gender && (
                      <span className="text-xs text-white/30 flex-shrink-0">{age} · {gender}</span>
                    )}
                  </div>
                  {about && (
                    <p className="text-xs text-white/35 truncate mt-0.5">{about}</p>
                  )}
                  <p className="text-xs mt-0.5" style={{ color: isOnline(lastSeen) ? "#86efac" : "rgba(255,255,255,0.2)" }}>
                    {formatLastSeen(lastSeen)}
                  </p>
                </div>

                {/* Chat button */}
                <Link href={`/chat/${_id}`} className="flex-shrink-0">
                  <button className="vm-btn vm-btn-ghost text-xs px-3 py-1.5">
                    Message
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
