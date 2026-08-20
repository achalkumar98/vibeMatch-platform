"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

// Feature preview cards shown in the scrolling ticker
const TICKER_ITEMS = [
  { label: "Swipe Feed", color: "#1a1a2e" },
  { label: "Real-time Chat", color: "#0d1b2a" },
  { label: "Connection Requests", color: "#1a0a2e" },
  { label: "Premium Plans", color: "#0a1a1a" },
  { label: "Admin Analytics", color: "#1a1a0a" },
  { label: "Infinite Scroll", color: "#2e1a0a" },
  { label: "Last Seen", color: "#0a2e1a" },
  { label: "Image Upload", color: "#1a2e0a" },
];

// Doubled for seamless loop
const TICKER = [...TICKER_ITEMS, ...TICKER_ITEMS];

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl pt-28 pb-20">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Now live — VibeMatch v2
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight">
            Match with
            <br />
            developers.
            <br />
            <span style={{ color: "rgba(255,255,255,0.38)" }}>
              Build together.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/50 max-w-xl leading-relaxed">
            Swipe through developer profiles, send connection requests, chat in
            real-time, and collaborate with the right people — all in one place.
          </p>

          {/* CTA row */}
          <div className="mt-10 flex flex-wrap gap-3 items-center">
            <Link href="/signup" className="vm-btn vm-btn-white text-sm px-5 py-2.5">
              Get started free
            </Link>
            <Link href="/login" className="vm-btn vm-btn-outline text-sm px-5 py-2.5">
              Sign in
            </Link>
            <span className="text-xs text-white/30 ml-1">No credit card required</span>
          </div>
        </div>

        {/* App preview mockup */}
        <div className="relative z-10 max-w-5xl w-full mx-auto">
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
            }}
          >
            {/* Mock browser bar */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <div
                className="ml-4 flex-1 h-6 rounded-md text-xs flex items-center px-3"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}
              >
                vibematch.dev/feed
              </div>
            </div>

            {/* Mock feed UI */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 min-h-[260px]">
              {[
                { name: "Achal Kumar", role: "Full-Stack Dev", color: "#1e1e3a" },
                { name: "Priya Sharma", role: "React Engineer", color: "#1e3a1e" },
                { name: "Rahul Verma", role: "Node.js Dev", color: "#3a1e1e" },
              ].map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 flex flex-col gap-3"
                  style={{ background: p.color, border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div>
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-xs text-white/40">{p.role}</div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <div className="flex-1 h-7 rounded-lg bg-white/5 text-xs flex items-center justify-center text-white/30">
                      Skip
                    </div>
                    <div className="flex-1 h-7 rounded-lg bg-white text-black text-xs flex items-center justify-center font-medium">
                      Connect
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 flex justify-center mt-12 mb-4">
          <div className="flex flex-col items-center gap-1 text-white/20 animate-bounce">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Ticker ────────────────────────────────────────────────────────── */}
      <section
        className="py-6 overflow-hidden"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="marquee-track">
          {TICKER.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center gap-3 px-5 py-2.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-sm text-white/70 whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Everything you need
          </h2>
          <p className="text-white/40 mb-12 text-base max-w-lg">
            A full-stack platform built for developers to discover, connect, and collaborate.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "⚡",
                title: "Swipe Feed",
                desc: "Infinite scroll feed with cursor-based pagination. Drag right to connect, left to skip.",
              },
              {
                icon: "💬",
                title: "Real-time Chat",
                desc: "Socket.IO powered 1:1 messaging with online indicators and last seen timestamps.",
              },
              {
                icon: "🖼️",
                title: "Smart Image Upload",
                desc: "Drag & drop photo upload via Cloudinary. Auto-optimized to 800×800, WebP format.",
              },
              {
                icon: "📊",
                title: "Admin Dashboard",
                desc: "Revenue charts, DAU graphs, user management and ban controls — all in one panel.",
              },
              {
                icon: "💎",
                title: "Premium Plans",
                desc: "Silver, Gold, Diamond tiers with Razorpay integration. Webhook-confirmed upgrades.",
              },
              {
                icon: "🕐",
                title: "Last Seen",
                desc: "Heartbeat mechanism tracks active users. See 'Last seen 5m ago' on every profile.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="glass-card p-6 flex flex-col gap-3 hover:border-white/15 transition-colors"
              >
                <span className="text-2xl">{f.icon}</span>
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ──────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 md:px-16 lg:px-24"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <p className="text-4xl sm:text-5xl font-bold leading-tight">
              Built by a developer,<br />
              <span style={{ color: "rgba(255,255,255,0.35)" }}>for developers.</span>
            </p>
            <p className="mt-5 text-white/40 text-base max-w-md leading-relaxed">
              VibeMatch is open-source and built with Next.js, TypeScript, Express, MongoDB, 
              Socket.IO, Cloudinary, and Razorpay — the full modern stack.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/signup" className="vm-btn vm-btn-white text-sm px-5 py-2.5">
                Start for free
              </Link>
              <a
                href="https://github.com/achalkumar98"
                target="_blank"
                rel="noopener noreferrer"
                className="vm-btn vm-btn-outline text-sm px-5 py-2.5"
              >
                View on GitHub
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 flex-shrink-0">
            {[
              { value: "100%", label: "TypeScript frontend" },
              { value: "REST + WS", label: "Dual API layer" },
              { value: "Cloudinary", label: "Optimized images" },
              { value: "Razorpay", label: "Payment gateway" },
            ].map((s, i) => (
              <div
                key={i}
                className="glass-card px-5 py-4 text-center"
              >
                <div className="text-lg font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/35 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          Ready to find your vibe?
        </h2>
        <p className="text-white/40 mb-8 text-base">
          Join VibeMatch and start connecting with developers around the world.
        </p>
        <Link href="/signup" className="vm-btn vm-btn-white text-base px-8 py-3">
          Get started — it&apos;s free
        </Link>
      </section>
    </div>
  );
}
