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

const NAV_LINKS = [
  { href: "/feed",        label: "Feed",        Icon: Zap      },
  { href: "/connections", label: "Connections", Icon: Users    },
  { href: "/requests",    label: "Requests",    Icon: UserPlus },
  { href: "/premium",     label: "Premium",     Icon: Star     },
];

export default function NavBar() {
  const user       = useAppSelector((s) => s.user);
  const dispatch   = useAppDispatch();
  const router     = useRouter();
  const pathname   = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height:                  "60px",
        background:              "var(--nav-bg)",
        borderBottom:            "1px solid var(--border)",
        backdropFilter:          "blur(20px)",
        WebkitBackdropFilter:    "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link
          href={user ? "/feed" : "/"}
          className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-80 transition-opacity"
          aria-label="VibeMatch home"
        >
          <Image
            src="/assets/vibeMatch-logo.png"
            alt="VibeMatch"
            width={36}
            height={36}
            className="vm-logo-img vm-logo-img--nav rounded-lg"
            priority
          />
          <span
            className="font-bold tracking-tight hidden sm:block"
            style={{ fontSize: "16px", letterSpacing: "-0.03em", color: "var(--text-primary)" }}
          >
            VibeMatch
          </span>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────────────────── */}
        {user && (
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background: isActive(href) ? "var(--bg-overlay)" : "transparent",
                  color:      isActive(href) ? "var(--text-primary)" : "var(--text-secondary)",
                  borderBottom: isActive(href) ? `2px solid var(--brand)` : "2px solid transparent",
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background:   pathname.startsWith("/admin") ? "var(--bg-overlay)" : "transparent",
                  color:        pathname.startsWith("/admin") ? "var(--text-primary)" : "var(--text-secondary)",
                  borderBottom: pathname.startsWith("/admin") ? `2px solid var(--brand)` : "2px solid transparent",
                }}
              >
                <LayoutDashboard size={14} strokeWidth={1.8} aria-hidden />
                Admin
              </Link>
            )}
          </div>
        )}

        {/* ── Right ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  {/* Avatar */}
                  <div
                    className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: "2px solid var(--border-strong)" }}
                  >
                    <Image
                      src={user.photoUrl || "https://api.dicebear.com/8.x/avataaars/svg?seed=" + encodeURIComponent(user.firstName)}
                      alt={`${user.firstName}'s avatar`}
                      fill
                      className="object-cover"
                      sizes="36px"
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
                    strokeWidth={2.2}
                    className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--text-muted)" }}
                    aria-hidden
                  />
                </button>

                {/* Dropdown panel */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2.5 w-52 rounded-2xl overflow-hidden shadow-2xl z-50"
                    style={{
                      background:    "var(--bg-surface)",
                      border:        "1px solid var(--border)",
                      animation:     "vm-fade-up 0.18s cubic-bezier(0.22,1,0.36,1) both",
                    }}
                  >
                    {/* User info header */}
                    <div
                      className="px-4 py-3 flex items-center gap-3"
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={user.photoUrl || "https://api.dicebear.com/8.x/avataaars/svg?seed=" + encodeURIComponent(user.firstName)}
                          alt="avatar"
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {user.firstName} {user.lastName}
                        </p>
                        <p
                          className="text-2xs truncate"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {user.emailId}
                        </p>
                      </div>
                    </div>

                    <div className="py-1">
                      {[
                        { href: "/profile", label: "Profile",          Icon: User          },
                        { href: "/premium", label: "Premium",          Icon: Star          },
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
                            const el = e.currentTarget as HTMLElement;
                            el.style.background = "var(--bg-overlay)";
                            el.style.color = "var(--text-primary)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.background = "transparent";
                            el.style.color = "var(--text-secondary)";
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
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--error-bg)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
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
                  ? <X    size={16} strokeWidth={2} aria-hidden />
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
          className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1"
          style={{
            background:   "var(--bg-surface)",
            borderBottom: "1px solid var(--border)",
            animation:    "vm-fade-up 0.2s cubic-bezier(0.22,1,0.36,1) both",
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
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium"
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
