"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeUser } from "@/redux/slices/userSlice";
import { logoutApi } from "@/api/profileApi";
import Image from "next/image";

export default function NavBar() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(removeUser());
      router.push("/login");
      setDropdownOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-white hover:opacity-80 transition truncate max-w-[50%] sm:max-w-full"
        >
          👩‍💻 VibeMatch
        </Link>

        {user && (
          <div className="flex items-center gap-4 relative">
            <span className="text-sm text-gray-300 hidden sm:block truncate max-w-[120px]">
              Welcome,{" "}
              <span className="font-semibold">{user.firstName}</span>
            </span>

            {/* Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                aria-label="Open user menu"
              >
                <Image
                  src={
                    user.photoUrl ||
                    "https://www.gravatar.com/avatar?d=mp"
                  }
                  alt="user avatar"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Animated dropdown */}
              <ul
                className={`absolute right-0 mt-2 w-44 bg-gray-800 rounded-lg shadow-lg flex flex-col gap-1 p-2 z-50 transition-all duration-300 transform ${
                  dropdownOpen
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0 pointer-events-none"
                }`}
              >
                {[
                  { href: "/premium", label: "Premium" },
                  { href: "/profile", label: "Profile" },
                  { href: "/connections", label: "Connections" },
                  { href: "/requests", label: "Requests" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="hover:bg-gray-700 block px-3 py-1 rounded transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:bg-gray-700 w-full text-left px-3 py-1 rounded transition"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
