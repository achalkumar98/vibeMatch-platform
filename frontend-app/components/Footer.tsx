import Link from "next/link";
import { Zap, Github, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="w-full py-8 px-6"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-brand-500" strokeWidth={2.2} aria-hidden />
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            VibeMatch
          </span>
          <span style={{ color: "var(--border-strong)" }} className="text-sm">·</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} All rights reserved
          </span>
        </div>

        {/* Links + socials */}
        <nav className="flex items-center gap-4" aria-label="Footer navigation">
          <Link
            href="/feed"
            className="text-xs transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
          >
            Feed
          </Link>
          <Link
            href="/premium"
            className="text-xs transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
          >
            Premium
          </Link>

          <div className="flex items-center gap-3 ml-2">
            <a
              href="https://github.com/achalkumar98"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
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
              aria-label="LinkedIn profile"
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
              aria-label="Instagram profile"
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
