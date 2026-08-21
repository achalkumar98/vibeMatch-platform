"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="w-full py-8 px-5 sm:px-6"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div
        className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5"
      >
        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          <Image
            src="/assets/vibeMatch-logo.png"
            alt="VibeMatch logo"
            width={32}
            height={32}
            className="vm-logo-img vm-logo-img--footer rounded-lg flex-shrink-0"
          />
          <span
            className="font-bold tracking-tight"
            style={{ fontSize: "15px", letterSpacing: "-0.02em", color: "var(--text-primary)" }}
          >
            VibeMatch
          </span>
          <span style={{ color: "var(--border-strong)" }} className="text-sm hidden sm:block">·</span>
          <span className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} All rights reserved
          </span>
        </div>

        {/* ── Nav + Socials ─────────────────────────────────────────────── */}
        <nav className="flex items-center gap-5" aria-label="Footer navigation">
          <Link
            href="/feed"
            className="text-xs font-medium transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
          >
            Feed
          </Link>
          <Link
            href="/premium"
            className="text-xs font-medium transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
          >
            Premium
          </Link>

          <div className="flex items-center gap-3.5">
            <a
              href="https://github.com/achalkumar98"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              <Github size={16} strokeWidth={1.8} aria-hidden />
            </a>
            <a
              href="https://www.linkedin.com/in/achalkumar1998"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0a66c2"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              <Linkedin size={16} strokeWidth={1.8} aria-hidden />
            </a>
            <a
              href="https://www.instagram.com/achal.pand98"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#e1306c"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              <Instagram size={16} strokeWidth={1.8} aria-hidden />
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
