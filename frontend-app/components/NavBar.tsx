"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeUser } from "@/redux/slices/userSlice";
import { logoutApi } from "@/api/profileApi";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/feed", label: "Feed" },
  { href: "/connections", label: "Connections" },
  { href: "/requests", label: "Requests" },
  { href: "/premium", label: "Premium" },
];

export default function NavBar() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
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
        background: "rgba(0,0,0,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href={user ? "/feed" : "/"}
          className="text-white font-semibold text-[15px] tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-lg">⚡</span>
          VibeMatch
        </Link>

        {/* Desktop nav — only shown when logged in */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive(href)
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            ))}
            {user.isAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  pathname.startsWith("/admin")
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                Admin
              </Link>
            )}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                  <Image
                    src={user.photoUrl || "https://www.gravatar.com/avatar?d=mp"}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden sm:block text-sm text-white/80 max-w-[100px] truncate">
                  {user.firstName}
                </span>
                <svg
                  className={`w-3 h-3 text-white/50 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden shadow-2xl z-50"
                  style={{
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="px-4 py-3 border-b border-white/8">
                    <p className="text-xs text-white/40 uppercase tracking-wider">Account</p>
                    <p className="text-sm text-white font-medium truncate">{user.firstName} {user.lastName}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { href: "/profile", label: "Profile" },
                      { href: "/premium", label: "Premium" },
                      ...(user.isAdmin ? [{ href: "/admin", label: "Admin Dashboard" }] : []),
                    ].map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="vm-btn vm-btn-white text-sm px-4 py-1.5"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Mobile hamburger — only when logged in */}
          {user && (
            <button
              className="md:hidden flex flex-col gap-1.5 p-1.5 text-white/70 hover:text-white"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {user && menuOpen && (
        <div
          className="md:hidden border-t px-5 py-3 flex flex-col gap-1"
          style={{
            background: "rgba(0,0,0,0.95)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                isActive(href) ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
          {user.isAdmin && (
            <Link href="/admin" className="px-3 py-2 rounded-md text-sm text-white/60 hover:text-white">
              Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-sm text-left text-red-400 hover:text-red-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
