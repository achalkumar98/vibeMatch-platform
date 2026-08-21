"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Zap, MessageSquare, ImageUp, BarChart3, Gem, Clock,
  ChevronDown, Github, ArrowRight, Sparkles, LayoutDashboard,
} from "lucide-react";

const MOCKUP_CARDS = [
  { Icon: Zap,             title: "Swipe Feed",      desc: "Drag right to connect, left to skip. Cursor-paginated, no duplicates.", color: "#f59e0b" },
  { Icon: MessageSquare,   title: "Real-time Chat",  desc: "Socket.IO 1:1 messaging with online presence and last-seen status.",     color: "#6366f1" },
  { Icon: LayoutDashboard, title: "Admin Dashboard", desc: "Revenue charts, DAU graphs, user management and ban controls.",          color: "#22c55e" },
];

const TICKER_ITEMS = [
  "Swipe Feed", "Real-time Chat", "Connection Requests", "Premium Plans",
  "Admin Analytics", "Infinite Scroll", "Last Seen", "Image Upload",
  "Cursor Pagination", "Heartbeat Presence", "OAuth Login",
];
const TICKER = [...TICKER_ITEMS, ...TICKER_ITEMS];

const FEATURES = [
  {
    Icon: Zap,
    title: "Swipe Feed",
    desc:  "Cursor-based infinite scroll. Drag right to connect, left to skip.",
    color: "#f59e0b",
    badge: { text: "Infinite Scroll", cls: "vm-snake-badge--amber" },
  },
  {
    Icon: MessageSquare,
    title: "Real-time Chat",
    desc:  "Socket.IO 1:1 messaging with online indicators and last-seen.",
    color: "#6366f1",
    badge: { text: "Live", cls: "vm-snake-badge--purple" },
  },
  {
    Icon: ImageUp,
    title: "Smart Upload",
    desc:  "Drag-and-drop Cloudinary upload. Auto-optimised to WebP 800×800.",
    color: "#22c55e",
    badge: { text: "Cloudinary", cls: "vm-snake-badge--green" },
  },
  {
    Icon: BarChart3,
    title: "Admin Dashboard",
    desc:  "Revenue charts, DAU graphs, user management and ban controls.",
    color: "#ec4899",
    badge: { text: "Analytics", cls: "vm-snake-badge--pink" },
  },
  {
    Icon: Gem,
    title: "Premium Plans",
    desc:  "Silver, Gold, Diamond tiers via Razorpay. Webhook-confirmed.",
    color: "#8b5cf6",
    badge: { text: "Razorpay", cls: "vm-snake-badge--purple" },
  },
  {
    Icon: Clock,
    title: "Last Seen",
    desc:  "Heartbeat tracks active users. See 'Active 5m ago' everywhere.",
    color: "#14b8a6",
    badge: { text: "Real-time", cls: "vm-snake-badge--cyan" },
  },
];

const STATS = [
  { value: "100%",       label: "TypeScript",       badge: { text: "Type-safe", cls: "vm-snake-badge--cyan"   } },
  { value: "REST + WS",  label: "Dual API layer",   badge: { text: "Socket.IO", cls: "vm-snake-badge--purple" } },
  { value: "Cloudinary", label: "Optimised images", badge: { text: "Auto CDN",  cls: "vm-snake-badge--green"  } },
  { value: "Razorpay",   label: "Payment gateway",  badge: { text: "Webhooks",  cls: "vm-snake-badge--amber"  } },
];

export default function LandingPage() {
  return (
    <div
      className="flex flex-col overflow-x-hidden"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col justify-center px-5 sm:px-10 md:px-16 lg:px-24 min-h-screen">

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 65% 45% at 50% 0%, var(--brand-subtle) 0%, transparent 72%)" }}
          aria-hidden
        />

        <div className="relative z-10 max-w-5xl w-full pt-24 sm:pt-32 pb-10 mx-auto">

          {/* Live badge */}
          <div
            className="vm-snake-badge vm-snake-badge--green vm-animate-fade-in mb-8"
            aria-label="Platform status: Live"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden />
            Platform live — VibeMatch v2
          </div>

          {/* Headline */}
          <h1
            className="font-bold leading-[1.03] tracking-tight vm-animate-fade-up"
            style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)" }}
          >
            Match with
            <br />
            <span className="vm-gradient-text">developers.</span>
            <br />
            <span
              className="vm-shimmer-text vm-animate-fade-up vm-delay-200"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}
            >
              Build together.
            </span>
          </h1>

          <p
            className="mt-6 max-w-xl leading-relaxed vm-animate-fade-up vm-delay-300"
            style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "var(--text-secondary)" }}
          >
            Swipe through developer profiles, send connection requests, chat in real-time,
            and collaborate with the right people — all in one place.
          </p>

          {/* CTA row */}
          <div className="mt-9 flex flex-wrap items-center gap-3 vm-animate-fade-up vm-delay-400">
            <Link href="/signup" className="vm-btn vm-btn-solid px-6 py-2.5 text-sm vm-btn-glow">
              <Sparkles size={14} strokeWidth={2} aria-hidden />
              Get started free
              <ArrowRight size={14} strokeWidth={2} aria-hidden />
            </Link>
            <Link href="/login" className="vm-btn vm-btn-outline px-5 py-2.5 text-sm">
              Sign in
            </Link>
            <span className="text-xs ml-1 hidden sm:block" style={{ color: "var(--text-disabled)" }}>
              No credit card required
            </span>
          </div>
        </div>

        {/* Browser mockup */}
        <div className="relative z-10 max-w-5xl w-full mx-auto mb-6 vm-animate-scale-up vm-delay-300">
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-surface)",
              border:     "1px solid var(--border)",
              boxShadow:  "0 30px 80px rgba(0,0,0,0.4)",
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
                style={{ background: "var(--bg-elevated)", color: "var(--text-disabled)" }}
              >
                vibematch.dev/feed
              </div>
              <div className="vm-snake-badge vm-snake-badge--green ml-auto" style={{ fontSize: "9px", padding: "1px 8px" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden />
                Live
              </div>
            </div>

            {/* Feature preview cards */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 min-h-[200px]">
              {MOCKUP_CARDS.map(({ Icon, title, desc, color }) => (
                <div
                  key={title}
                  className="rounded-xl p-4 flex flex-col gap-2"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                  >
                    <Icon size={15} strokeWidth={1.8} style={{ color }} aria-hidden />
                  </div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="flex justify-center mb-8 vm-animate-fade-in vm-delay-600">
          <div className="flex flex-col items-center gap-1 animate-bounce" style={{ color: "var(--text-disabled)" }} aria-hidden>
            <ChevronDown size={18} strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TICKER
          ═══════════════════════════════════════════════════════════════════ */}
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
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}
            >
              <Zap size={11} style={{ color: "var(--brand)" }} aria-hidden />
              <span className="text-sm whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURES GRID
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-10 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">

          <div className="vm-snake-badge vm-snake-badge--purple mb-5 vm-animate-fade-in" style={{ fontSize: "10px" }}>
            <Sparkles size={10} strokeWidth={2} aria-hidden />
            Platform features
          </div>

          <h2
            className="font-bold tracking-tight mb-3 vm-animate-fade-up"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}
          >
            Everything you need
          </h2>
          <p
            className="mb-12 max-w-lg leading-relaxed vm-animate-fade-up vm-delay-100"
            style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}
          >
            A full-stack platform built for developers to discover, connect, and collaborate.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ Icon, title, desc, color, badge }, i) => (
              <div
                key={title}
                className={`glass-card p-6 flex flex-col gap-3 vm-animate-scale-up vm-delay-${(i % 3) * 100 + 100}`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}1a`, border: `1px solid ${color}30` }}
                    aria-hidden
                  >
                    <Icon size={17} style={{ color }} strokeWidth={1.8} />
                  </div>
                  <span
                    className={`vm-snake-badge ${badge.cls}`}
                    style={{ fontSize: "9px", padding: "1px 8px" }}
                  >
                    {badge.text}
                  </span>
                </div>
                <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TECH STACK / SOCIAL PROOF
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-5 sm:px-10 md:px-16 lg:px-24"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-14">

          <div className="flex-1 min-w-0">
            <div className="vm-snake-badge vm-snake-badge--cyan mb-5 vm-animate-fade-in" style={{ fontSize: "10px" }}>
              <Github size={10} strokeWidth={2} aria-hidden />
              Open source
            </div>

            <h2
              className="font-bold tracking-tight leading-tight vm-animate-fade-up"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
            >
              Built by a developer,
              <br />
              <span style={{ color: "var(--text-muted)" }}>for developers.</span>
            </h2>
            <p
              className="mt-5 max-w-md leading-relaxed vm-animate-fade-up vm-delay-100"
              style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}
            >
              VibeMatch is open-source, built with Next.js 15, TypeScript, Express, MongoDB,
              Socket.IO, Cloudinary, and Razorpay — the complete modern stack.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 vm-animate-fade-up vm-delay-200">
              <Link href="/signup" className="vm-btn vm-btn-solid px-5 py-2.5 text-sm vm-btn-glow">
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

          <div className="grid grid-cols-2 gap-4 flex-shrink-0 vm-animate-scale-up vm-delay-200">
            {STATS.map(({ value, label, badge }) => (
              <div key={label} className="glass-card px-5 py-5 text-center min-w-[130px]">
                <div className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>
                  {value}
                </div>
                <div className="text-xs mb-2.5" style={{ color: "var(--text-muted)" }}>
                  {label}
                </div>
                <span
                  className={`vm-snake-badge ${badge.cls}`}
                  style={{ fontSize: "8px", padding: "1px 7px" }}
                >
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-28 px-5 text-center"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div
          className="vm-snake-badge vm-snake-badge--amber vm-animate-fade-in mx-auto mb-7"
          style={{ fontSize: "10px" }}
        >
          <Sparkles size={10} strokeWidth={2} aria-hidden />
          Join the community
        </div>

        <h2
          className="font-bold tracking-tight mb-4 vm-animate-fade-up"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
        >
          Ready to find your vibe?
        </h2>
        <p
          className="mb-8 text-sm max-w-md mx-auto vm-animate-fade-up vm-delay-100"
          style={{ color: "var(--text-muted)" }}
        >
          Join VibeMatch and start connecting with developers around the world.
          Free to join, always.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 vm-animate-fade-up vm-delay-200">
          <Link href="/signup" className="vm-btn vm-btn-solid px-8 py-3 text-base vm-btn-glow">
            <Sparkles size={16} strokeWidth={2} aria-hidden />
            Get started — it&apos;s free
            <ArrowRight size={15} strokeWidth={2} aria-hidden />
          </Link>
          <Link href="/login" className="vm-btn vm-btn-outline px-6 py-3 text-base">
            Sign in
          </Link>
        </div>

        <div className="flex items-center justify-center gap-3 mt-14 vm-animate-fade-in vm-delay-400">
          <Image
            src="/assets/vibeMatch-logo.png"
            alt="VibeMatch"
            width={28}
            height={28}
            className="vm-logo-img rounded-lg opacity-60"
            style={{ width: 28, height: 28 }}
          />
          <span className="text-sm font-semibold" style={{ color: "var(--text-disabled)", letterSpacing: "-0.01em" }}>
            VibeMatch
          </span>
        </div>
      </section>
    </div>
  );
}
