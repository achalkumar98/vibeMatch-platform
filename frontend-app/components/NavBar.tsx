"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Zap,
  Users,
  UserPlus,
  Star,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeUser } from "@/redux/slices/userSlice";
import { logoutApi } from "@/api/profileApi";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/feed",        label: "Feed",        Icon: Zap },
  { href: "/connections", label: "Connections", Icon: Users },
  { href: "/requests",    label: "Requests",    Icon: UserPlus },
  { href: "/premium",     label: "Premium",     Icon: Star },
];

export default function NavBar() {
  const user       = useAppSelector((s) => s.user);
  const dispatch   = useAppDispatch();
  const router     = useRouter();
  const pathname   = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close everything on route change */
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(removeUser());
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-14"
      style={{
        background:             "var(--nav-bg)",
        borderBottom:           "1px solid var(--border)",
        backdropFilter:         "blur(18px)",
        WebkitBackdropFilter:   "blur(18px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link
          href={user ? "/feed" : "/"}
          className="vm-navbar__logo"
          aria-label="VibeMatch home"
        >
          <Image
            src="/assets/vibeMatch-logo.png"
            alt="VibeMatch"
            width={28}
            height={28}
            className="vm-navbar__logo-img"
            priority
          />
          <span className="vm-navbar__logo-text">VibeMatch</span>
        </Link>

        {/* ── Desktop nav (authenticated) ──────────────────────────────── */}
        {user && (
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: isActive(href) ? "var(--bg-overlay)" : "transparent",
                  color:      isActive(href) ? "var(--text-primary)" : "var(--text-secondary)",
                }}
                aria-current={isActive(href) ? "page" : undefined}
              >
                <Icon size={14} strokeWidth={1.8} aria-hidden />
                {label}
              </Link>
            ))}
            {user.isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: pathname.startsWith("/admin") ? "var(--bg-overlay)" : "transparent",
                  color:      pathname.startsWith("/admin") ? "var(--text-primary)" : "var(--text-secondary)",
                }}
                aria-current={pathname.startsWith("/admin") ? "page" : undefined}
              >
                <LayoutDashboard size={14} strokeWidth={1.8} aria-hidden />
                Admin
              </Link>
            )}
          </div>
        )}

        {/* ── Right side ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme toggle — always visible */}
          <ThemeToggle />

          {user ? (
            <>
              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2"
                  style={{ "--tw-ring-color": "var(--brand)" } as React.CSSProperties}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden shrink-0"
                    style={{ border: "1.5px solid var(--border-strong)" }}
                  >
                    <Image
                      src={user.photoUrl || "https://www.gravatar.com/avatar?d=mp"}
                      alt="Your avatar"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="hidden sm:block text-sm font-medium max-w-[88px] truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {user.firstName}
                  </span>
                  <ChevronDown
                    size={13}
                    strokeWidth={2}
                    className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--text-muted)" }}
                    aria-hidden
                  />
                </button>

                {/* Dropdown panel */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in"
                    style={{
                      background: "var(--bg-surface)",
                      border:     "1px solid var(--border)",
                    }}
                  >
                    {/* Header */}
                    <div
                      className="px-4 py-3"
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <p className="text-2xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold truncate mt-0.5" style={{ color: "var(--text-primary)" }}>
                        {user.firstName} {user.lastName}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      {[
                        { href: "/profile",  label: "Profile",           Icon: User },
                        { href: "/premium",  label: "Premium",           Icon: Star },
                        ...(user.isAdmin
                          ? [{ href: "/admin", label: "Admin Dashboard", Icon: LayoutDashboard }]
                          : []),
                      ].map(({ href, label, Icon: Ic }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
                          style={{ color: "var(--text-secondary)" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "var(--bg-overlay)";
                            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                          }}
                        >
                          <Ic size={14} strokeWidth={1.8} aria-hidden />
                          {label}
                        </Link>
                      ))}

                      <div style={{ borderTop: "1px solid var(--border)" }} className="mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm transition-colors"
                          style={{ color: "var(--error)" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "var(--error-bg)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                          }}
                        >
                          <LogOut size={14} strokeWidth={1.8} aria-hidden />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden vm-btn vm-btn-ghost w-8 h-8 p-0 rounded-lg"
                onClick={() => setMenuOpen((p) => !p)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen
                  ? <X size={16} strokeWidth={2} aria-hidden />
                  : <Menu size={16} strokeWidth={2} aria-hidden />
                }
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
              >
                Log in
              </Link>
              <Link href="/signup" className="vm-btn vm-btn-solid text-sm px-4 py-1.5">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile slide-down menu ────────────────────────────────────────── */}
      {user && menuOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1 animate-slide-up"
          style={{
            background:  "var(--bg-surface)",
            borderTop:   "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {NAV_LINKS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: isActive(href) ? "var(--bg-overlay)" : "transparent",
                color:      isActive(href) ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              <Icon size={15} strokeWidth={1.8} aria-hidden />
              {label}
            </Link>
          ))}
          {user.isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              <LayoutDashboard size={15} strokeWidth={1.8} aria-hidden />
              Admin Dashboard
            </Link>
          )}
          <div style={{ borderTop: "1px solid var(--border)" }} className="mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: "var(--error)" }}
            >
              <LogOut size={15} strokeWidth={1.8} aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
