"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { X, Zap, Loader2, PartyPopper, Clock, Heart } from "lucide-react";
import { getFeedApi } from "@/api/feedApi";
import { sendRequestApi } from "@/api/requestApi";
import type { FeedUser } from "@/types";

/* Professional neutral avatar */
const avatarFor = (u: FeedUser) =>
  u.photoUrl ||
  `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(
    u.firstName + u.lastName
  )}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

export default function FeedPage() {
  const [users,          setUsers]          = useState<FeedUser[]>([]);
  const [cursor,         setCursor]         = useState<string | null>(null);
  const [hasMore,        setHasMore]        = useState(true);
  const [loading,        setLoading]        = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error,          setError]          = useState<string | null>(null);
  const [actionedIds,    setActionedIds]    = useState<Set<string>>(new Set());
  const [currentIndex,   setCurrentIndex]   = useState(0);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await getFeedApi(cursor, 10);
      setUsers((prev) => {
        const ids  = new Set(prev.map((u) => u._id));
        const next = result.users.filter((u) => !ids.has(u._id));
        return [...prev, ...next];
      });
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load feed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [cursor, hasMore, loading]);

  useEffect(() => { loadMore(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  const visibleUsers = users.filter((u) => !actionedIds.has(u._id));
  const currentUser  = visibleUsers[currentIndex] ?? null;

  const handleAction = async (status: "interested" | "ignored", userId: string) => {
    setActionedIds((prev) => new Set([...prev, userId]));
    try {
      await sendRequestApi(status, userId);
      if (status === "interested") toast.success("Connection request sent!");
    } catch {
      toast.error("Could not send request. Try again.");
    }
    setCurrentIndex((i) => Math.min(i, visibleUsers.length - 2));
  };

  /* ── States ─────────────────────────────────────────────────────────── */
  if (initialLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-base)", paddingTop: "60px" }}
      >
        <div className="flex flex-col items-center gap-3" style={{ color: "var(--text-muted)" }}>
          <Loader2 size={28} className="animate-spin" aria-label="Loading" />
          <p className="text-sm">Loading your feed…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-base)", paddingTop: "60px" }}
      >
        <p className="text-sm" style={{ color: "var(--error)" }} role="alert">{error}</p>
      </div>
    );
  }

  if (visibleUsers.length === 0 && !hasMore) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-base)", paddingTop: "60px" }}
      >
        <div className="text-center">
          <PartyPopper size={44} className="mx-auto mb-4" style={{ color: "var(--brand)" }} aria-hidden />
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            You&apos;ve seen everyone!
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Check back later for new developers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", paddingTop: "60px" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

          {/* ── Main card ─────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[520px]">
            {currentUser ? (
              <SwipeCard
                key={currentUser._id}
                user={currentUser}
                onInterested={() => handleAction("interested", currentUser._id)}
                onIgnored={() => handleAction("ignored", currentUser._id)}
              />
            ) : loading ? (
              <div
                className="flex items-center gap-2 text-sm mt-20"
                style={{ color: "var(--text-muted)" }}
              >
                <Loader2 size={14} className="animate-spin" aria-hidden />
                Loading more…
              </div>
            ) : null}

            {/* Progress bar */}
            {visibleUsers.length > 0 && (
              <div
                className="mt-6 flex items-center gap-2 text-xs"
                style={{ color: "var(--text-disabled)" }}
              >
                <span>{currentIndex + 1}</span>
                <div
                  className="w-24 h-0.5 rounded-full overflow-hidden"
                  style={{ background: "var(--border)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width:      `${((currentIndex + 1) / visibleUsers.length) * 100}%`,
                      background: "var(--brand)",
                    }}
                  />
                </div>
                <span>{visibleUsers.length}</span>
              </div>
            )}
          </div>

          {/* ── Side queue ────────────────────────────────────────────── */}
          <aside className="lg:w-64 flex flex-col gap-3" aria-label="Upcoming profiles">
            <p
              className="text-2xs font-semibold uppercase tracking-widest px-1"
              style={{ color: "var(--text-muted)" }}
            >
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
              <p className="text-xs px-1" style={{ color: "var(--text-disabled)" }}>
                No more queued profiles
              </p>
            )}
          </aside>
        </div>
      </div>

      <div ref={sentinelRef} className="h-1" aria-hidden />
    </div>
  );
}

/* ── SwipeCard — drag left to ignore, drag right to connect ─────────────── */

function SwipeCard({
  user,
  onInterested,
  onIgnored,
}: {
  user: FeedUser;
  onInterested: () => void;
  onIgnored: () => void;
}) {
  const { firstName, lastName, age, gender, about, skills, lastSeen } = user;
  const lastSeenLabel = lastSeen ? formatLastSeen(lastSeen) : null;

  const x        = useMotionValue(0);
  const rotate   = useTransform(x, [-200, 200], [-18, 18]);
  const opacity  = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  /* Overlay indicators */
  const connectOpacity = useTransform(x, [20, 100], [0, 1]);
  const ignoreOpacity  = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      animate(x, 600, { duration: 0.35 }).then(onInterested);
    } else if (info.offset.x < -threshold) {
      animate(x, -600, { duration: 0.35 }).then(onIgnored);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      <motion.article
        style={{
          x, rotate, opacity,
          background: "var(--bg-surface)",
          border:     "1px solid var(--border)",
          boxShadow:  "0 20px 50px rgba(0,0,0,0.25)",
          touchAction: "none",
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        className="w-full max-w-sm rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
        whileTap={{ scale: 1.02 }}
      >
        {/* Photo */}
        <div className="relative h-80">
          <Image
            src={avatarFor(user)}
            alt={`${firstName}'s photo`}
            fill
            className="object-cover"
            sizes="384px"
            priority
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

          {/* Swipe indicators */}
          <motion.div
            style={{ opacity: connectOpacity }}
            className="absolute top-5 left-5 px-3 py-1.5 rounded-xl border-2 border-green-400 text-green-400 font-bold text-lg rotate-[-15deg]"
          >
            <Heart size={18} className="inline mr-1" />CONNECT
          </motion.div>
          <motion.div
            style={{ opacity: ignoreOpacity }}
            className="absolute top-5 right-5 px-3 py-1.5 rounded-xl border-2 border-red-400 text-red-400 font-bold text-lg rotate-[15deg]"
          >
            <X size={18} className="inline mr-1" />SKIP
          </motion.div>

          {/* Name overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold text-white">
              {firstName} {lastName}
            </h2>
            {age && gender && (
              <p className="text-sm text-white/65">{age} · {gender}</p>
            )}
          </div>

          {/* Last seen */}
          {lastSeenLabel && (
            <div
              className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-white/70"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
              aria-label={`Activity: ${lastSeenLabel}`}
            >
              <Clock size={10} strokeWidth={2} aria-hidden />
              {lastSeenLabel}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          {about && (
            <p
              className="text-sm leading-relaxed line-clamp-3 mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              {about}
            </p>
          )}

          {skills && skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5" role="list" aria-label="Skills">
              {skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  role="listitem"
                  className="px-2.5 py-0.5 rounded-full text-xs"
                  style={{
                    background: "var(--bg-elevated)",
                    border:     "1px solid var(--border)",
                    color:      "var(--text-secondary)",
                  }}
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
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--error-bg)";
                el.style.borderColor = "var(--error)";
                el.style.color = "var(--error)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.borderColor = "var(--border)";
                el.style.color = "var(--text-muted)";
              }}
              aria-label="Skip this profile"
            >
              <X size={14} strokeWidth={2} aria-hidden />
              Skip
            </button>
            <button
              onClick={onInterested}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-85"
              style={{ background: "var(--brand)", color: "#fff" }}
              aria-label="Connect with this developer"
            >
              <Zap size={14} strokeWidth={2} aria-hidden />
              Connect
            </button>
          </div>
        </div>
      </motion.article>

      {/* Swipe hint */}
      <p className="mt-3 text-xs" style={{ color: "var(--text-disabled)" }}>
        ← Swipe left to skip · Swipe right to connect →
      </p>
    </div>
  );
}

/* ── MiniCard ─────────────────────────────────────────────────────────────── */

function MiniCard({ user, onClick }: { user: FeedUser; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
      style={{ border: "1px solid var(--border)", background: "transparent" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-overlay)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 relative">
        <Image
          src={avatarFor(user)}
          alt={user.firstName}
          fill
          className="object-cover"
          sizes="36px"
        />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
          {user.firstName} {user.lastName}
        </div>
        {user.age && (
          <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
            {user.age} · {user.gender}
          </div>
        )}
      </div>
    </button>
  );
}

/* ── Helper ──────────────────────────────────────────────────────────────── */

function formatLastSeen(lastSeen: string): string {
  const diff    = Date.now() - new Date(lastSeen).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1)  return "Active now";
  if (minutes < 60) return `Active ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `Active ${hours}h ago`;
  return `Active ${Math.floor(hours / 24)}d ago`;
}
