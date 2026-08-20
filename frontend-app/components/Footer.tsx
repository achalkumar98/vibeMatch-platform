import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="w-full py-8 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-base">⚡</span>
          <span className="text-sm font-medium text-white/80">VibeMatch</span>
          <span className="text-white/20 text-sm">·</span>
          <span className="text-xs text-white/30">
            © {new Date().getFullYear()} All rights reserved
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-5" aria-label="Footer links">
          <Link href="/feed" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Feed
          </Link>
          <Link href="/premium" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Premium
          </Link>
          <a
            href="https://github.com/achalkumar98"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/70 transition-colors"
            aria-label="GitHub"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.997.107-.775.42-1.305.762-1.605-2.665-.3-5.467-1.335-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 013.003-.403c1.02.005 2.045.138 3.003.403 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.77.84 1.23 1.91 1.23 3.22 0 4.61-2.807 5.625-5.48 5.92.435.375.825 1.11.825 2.237 0 1.616-.015 2.916-.015 3.312 0 .315.21.697.825.577C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/achalkumar1998"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/70 transition-colors"
            aria-label="LinkedIn"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.09 20.45H3.54V9h3.55v11.45zM5.31 7.54c-1.14 0-2.07-.93-2.07-2.08s.93-2.08 2.07-2.08 2.08.93 2.08 2.08-.94 2.08-2.08 2.08zm15.14 12.91h-3.54v-5.6c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.7h-3.54V9h3.4v1.56h.05c.47-.89 1.61-1.83 3.31-1.83 3.54 0 4.19 2.33 4.19 5.36v6.89z" />
            </svg>
          </a>
        </nav>
      </div>
    </footer>
  );
}
