"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getFeedApi } from "@/api/feedApi";
import { sendRequestApi } from "@/api/requestApi";
import type { FeedUser } from "@/types";
import Image from "next/image";

export default function FeedPage() {
  const [users, setUsers] = useState<FeedUser[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionedIds, setActionedIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await getFeedApi(cursor, 10);
      setUsers((prev) => {
        const existingIds = new Set(prev.map((u) => u._id));
        const fresh = result.users.filter((u) => !existingIds.has(u._id));
        return [...prev, ...fresh];
      });
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feed");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [cursor, hasMore, loading]);

  // Initial load
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const visibleUsers = users.filter((u) => !actionedIds.has(u._id));
  const currentUser = visibleUsers[currentIndex] ?? null;

  const handleAction = async (status: "interested" | "ignored", userId: string) => {
    setActionedIds((prev) => new Set([...prev, userId]));
    try {
      await sendRequestApi(status, userId);
    } catch {
      // silent — user is already removed from view
    }
    setCurrentIndex((i) => Math.min(i, visibleUsers.length - 2));
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{ paddingTop: "56px" }}>
        <div className="flex flex-col items-center gap-4 text-white/30">
          <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm">Loading your feed…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{ paddingTop: "56px" }}>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (visibleUsers.length === 0 && !hasMore) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{ paddingTop: "56px" }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-semibold text-white mb-2">You&apos;ve seen everyone!</h2>
          <p className="text-sm text-white/40">Check back later for new developers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" style={{ paddingTop: "56px" }}>
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Card stack ──────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center">
            {currentUser ? (
              <ProfileCard
                user={currentUser}
                onInterested={() => handleAction("interested", currentUser._id)}
                onIgnored={() => handleAction("ignored", currentUser._id)}
              />
            ) : loading ? (
              <div className="flex items-center gap-2 text-white/30 text-sm mt-20">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading more…
              </div>
            ) : null}

            {/* Progress indicator */}
            {visibleUsers.length > 0 && (
              <div className="mt-6 flex items-center gap-2 text-xs text-white/25">
                <span>{currentIndex + 1}</span>
                <div className="w-24 h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/40 rounded-full transition-all"
                    style={{ width: `${((currentIndex + 1) / visibleUsers.length) * 100}%` }}
                  />
                </div>
                <span>{visibleUsers.length}</span>
              </div>
            )}
          </div>

          {/* ── Side queue ──────────────────────────────────────────────── */}
          <div className="lg:w-72 flex flex-col gap-3">
            <p className="text-xs text-white/30 font-medium uppercase tracking-widest px-1">
              Up next
            </p>
            {visibleUsers.slice(currentIndex + 1, currentIndex + 5).map((u) => (
              <MiniCard
                key={u._id}
                user={u}
                onClick={() => setCurrentIndex(visibleUsers.indexOf(u))}
              />
            ))}
            {visibleUsers.slice(currentIndex + 1).length === 0 && !loading && (
              <p className="text-xs text-white/20 px-1">No more queued profiles</p>
            )}
          </div>
        </div>
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}

// ── ProfileCard ──────────────────────────────────────────────────────────────

function ProfileCard({
  user,
  onInterested,
  onIgnored,
}: {
  user: FeedUser;
  onInterested: () => void;
  onIgnored: () => void;
}) {
  const { firstName, lastName, age, gender, photoUrl, about, skills, lastSeen } = user;

  const lastSeenLabel = lastSeen
    ? formatLastSeen(lastSeen)
    : null;

  return (
    <div
      className="w-full max-w-sm rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Photo */}
      <div className="relative h-72">
        <Image
          src={photoUrl || "https://www.gravatar.com/avatar?d=mp"}
          alt={`${firstName}'s photo`}
          fill
          className="object-cover"
          sizes="384px"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {/* Name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-xl font-bold text-white">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-sm text-white/60">
              {age} · {gender}
            </p>
          )}
        </div>
        {/* Last seen badge */}
        {lastSeenLabel && (
          <div
            className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs text-white/60"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
          >
            {lastSeenLabel}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {about && (
          <p className="text-sm text-white/60 leading-relaxed line-clamp-3 mb-4">{about}</p>
        )}

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-0.5 rounded-full text-xs text-white/60"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onIgnored}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 transition-colors hover:text-white hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            aria-label="Skip"
          >
            Skip
          </button>
          <button
            onClick={onInterested}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white text-black transition-opacity hover:opacity-85"
            aria-label="Connect"
          >
            Connect ⚡
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MiniCard ─────────────────────────────────────────────────────────────────

function MiniCard({ user, onClick }: { user: FeedUser; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-white/5"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 relative">
        <Image
          src={user.photoUrl || "https://www.gravatar.com/avatar?d=mp"}
          alt={user.firstName}
          fill
          className="object-cover"
          sizes="36px"
        />
      </div>
      <div className="min-w-0">
        <div className="text-sm text-white truncate">{user.firstName} {user.lastName}</div>
        {user.age && (
          <div className="text-xs text-white/30 truncate">{user.age} · {user.gender}</div>
        )}
      </div>
    </button>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatLastSeen(lastSeen: string): string {
  const diff = Date.now() - new Date(lastSeen).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Active now";
  if (minutes < 60) return `Active ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Active ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Active ${days}d ago`;
}
