"use client";

import Link from "next/link";
import {
  Zap,
  MessageSquare,
  ImageUp,
  BarChart3,
  Gem,
  Clock,
  ChevronDown,
  Github,
  ArrowRight,
} from "lucide-react";

const TICKER_ITEMS = [
  "Swipe Feed",
  "Real-time Chat",
  "Connection Requests",
  "Premium Plans",
  "Admin Analytics",
  "Infinite Scroll",
  "Last Seen",
  "Image Upload",
  "Cursor Pagination",
  "Heartbeat Presence",
];
const TICKER = [...TICKER_ITEMS, ...TICKER_ITEMS];

const FEATURES = [
  {
    Icon: Zap,
    title: "Swipe Feed",
    desc: "Infinite scroll with cursor-based pagination. Drag right to connect, left to skip.",
    color: "#f59e0b",
  },
  {
    Icon: MessageSquare,
    title: "Real-time Chat",
    desc: "Socket.IO powered 1:1 messaging with online indicators and last-seen timestamps.",
    color: "#6366f1",
  },
  {
    Icon: ImageUp,
    title: "Smart Image Upload",
    desc: "Drag-and-drop Cloudinary upload. Auto-optimised 800×800 WebP — zero bloat.",
    color: "#22c55e",
  },
  {
    Icon: BarChart3,
    title: "Admin Dashboard",
    desc: "Revenue charts, DAU graphs, user management and ban controls — one panel.",
    color: "#ec4899",
  },
  {
    Icon: Gem,
    title: "Premium Plans",
    desc: "Silver, Gold, Diamond tiers with Razorpay. Webhook-confirmed upgrades.",
    color: "#8b5cf6",
  },
  {
    Icon: Clock,
    title: "Last Seen",
    desc: "Heartbeat mechanism tracks active users. See 'Active 5m ago' on every profile.",
    color: "#14b8a6",
  },
];

const STATS = [
  { value: "100%", label: "TypeScript frontend" },
  { value: "REST + WS", label: "Dual API layer" },
  { value: "Cloudinary", label: "Optimised images" },
  { value: "Razorpay", label: "Payment gateway" },
];

export default function LandingPage() {
  return (
    <div
      className="flex flex-col overflow-x-hidden"
      style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-center px-5 sm:px-10 md:px-16 lg:px-24 min-h-screen">
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 45% at 50% 0%, var(--brand-subtle) 0%, transparent 72%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 max-w-5xl w-full pt-24 sm:pt-32 pb-16 mx-auto">
          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 cursor-default"
            style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-strong)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden />
            <span style={{ color: "var(--text-secondary)" }}>Now live — VibeMatch v2</span>
          </div>

          {/* Headline */}
          <h1
            className="font-bold leading-[1.04] tracking-tight"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
              color: "var(--text-primary)",
            }}
          >
            Match with
            <br />
            developers.
            <br />
            <span style={{ color: "var(--text-muted)" }}>Build together.</span>
          </h1>

          <p
            className="mt-6 max-w-lg leading-relaxed"
            style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "var(--text-secondary)" }}
          >
            Swipe through developer profiles, send connection requests, chat in
            real-time, and collaborate with the right people — all in one place.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/signup" className="vm-btn vm-btn-solid px-6 py-2.5 text-sm">
              Get started free
              <ArrowRight size={14} strokeWidth={2} aria-hidden />
            </Link>
            <Link href="/login" className="vm-btn vm-btn-outline px-5 py-2.5 text-sm">
              Sign in
            </Link>
            <span
              className="text-xs ml-1 hidden sm:block"
              style={{ color: "var(--text-disabled)" }}
            >
              No credit card required
            </span>
          </div>
        </div>

        {/* Browser mockup */}
        <div className="relative z-10 max-w-5xl w-full mx-auto mt-2 mb-6">
          <div
            className="w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "var(--bg-surface)",
              border:     "1px solid var(--border)",
              boxShadow:  "0 30px 80px rgba(0,0,0,0.35)",
            }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-1.5 px-4 py-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <div
                className="ml-4 flex-1 h-6 rounded-md text-xs flex items-center px-3"
                style={{
                  background: "var(--bg-elevated)",
                  color:      "var(--text-disabled)",
                }}
              >
                vibematch.dev/feed
              </div>
            </div>

            {/* Mock feed cards */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 min-h-[200px]">
              {[
                { name: "Achal Kumar",  role: "Full-Stack Dev" },
                { name: "Priya Sharma", role: "React Engineer" },
                { name: "Rahul Verma",  role: "Node.js Expert" },
              ].map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 flex flex-col gap-3"
                  style={{
                    background: "var(--bg-elevated)",
                    border:     "1px solid var(--border)",
                  }}
                >
                  <div className="w-9 h-9 rounded-full skeleton" />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {p.name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {p.role}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <div
                      className="flex-1 h-7 rounded-lg text-xs flex items-center justify-center"
                      style={{ background: "var(--bg-overlay)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                    >
                      Skip
                    </div>
                    <div
                      className="flex-1 h-7 rounded-lg text-xs flex items-center justify-center font-medium"
                      style={{ background: "var(--text-primary)", color: "var(--bg-base)" }}
                    >
                      Connect
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="flex justify-center mb-8">
          <div
            className="flex flex-col items-center gap-1 animate-bounce"
            style={{ color: "var(--text-disabled)" }}
            aria-hidden
          >
            <ChevronDown size={18} strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────────────────────── */}
      <section
        className="py-5 overflow-hidden"
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
        aria-label="Feature highlights"
      >
        <div className="marquee-track" role="list">
          {TICKER.map((label, i) => (
            <div
              key={i}
              role="listitem"
              className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2 rounded-xl"
              style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}
            >
              <Zap size={11} style={{ color: "var(--brand)" }} aria-hidden />
              <span
                className="text-sm whitespace-nowrap"
                style={{ color: "var(--text-secondary)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature grid ─────────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-10 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--brand)" }}
          >
            Platform features
          </p>
          <h2
            className="font-bold tracking-tight mb-3"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", color: "var(--text-primary)" }}
          >
            Everything you need
          </h2>
          <p
            className="mb-12 max-w-lg leading-relaxed"
            style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}
          >
            A full-stack platform built for developers to discover, connect, and collaborate.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ Icon, title, desc, color }) => (
              <div key={title} className="glass-card p-6 flex flex-col gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                  aria-hidden
                >
                  <Icon size={17} style={{ color }} strokeWidth={1.8} />
                </div>
                <h3
                  className="font-semibold text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ─────────────────────────────────────────────────── */}
      <section
        className="py-20 px-5 sm:px-10 md:px-16 lg:px-24"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 min-w-0">
            <h2
              className="font-bold tracking-tight leading-tight"
              style={{
                fontSize: "clamp(1.8rem, 5vw, 3rem)",
                color:    "var(--text-primary)",
              }}
            >
              Built by a developer,
              <br />
              <span style={{ color: "var(--text-muted)" }}>for developers.</span>
            </h2>
            <p
              className="mt-5 max-w-md leading-relaxed"
              style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}
            >
              VibeMatch is open-source, built with Next.js, TypeScript, Express, MongoDB,
              Socket.IO, Cloudinary, and Razorpay.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="vm-btn vm-btn-solid px-5 py-2.5 text-sm">
                Start for free
                <ArrowRight size={13} strokeWidth={2} aria-hidden />
              </Link>
              <a
                href="https://github.com/achalkumar98"
                target="_blank"
                rel="noopener noreferrer"
                className="vm-btn vm-btn-outline px-5 py-2.5 text-sm"
              >
                <Github size={14} strokeWidth={1.8} aria-hidden />
                View on GitHub
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            {STATS.map((s) => (
              <div key={s.label} className="glass-card px-5 py-4 text-center min-w-[120px]">
                <div
                  className="font-bold text-base"
                  style={{ color: "var(--text-primary)" }}
                >
                  {s.value}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section
        className="py-24 px-5 text-center"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <h2
          className="font-bold tracking-tight mb-4"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "var(--text-primary)" }}
        >
          Ready to find your vibe?
        </h2>
        <p className="mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
          Join VibeMatch and start connecting with developers around the world.
        </p>
        <Link href="/signup" className="vm-btn vm-btn-solid px-8 py-3 text-base">
          Get started — it&apos;s free
          <ArrowRight size={15} strokeWidth={2} aria-hidden />
        </Link>
      </section>
    </div>
  );
}
