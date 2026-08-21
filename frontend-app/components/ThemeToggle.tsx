"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-20 h-8 rounded-lg skeleton" aria-hidden />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
      style={{
        background:   "var(--bg-elevated)",
        border:       "1px solid var(--border-strong)",
        color:        "var(--text-primary)",
        minWidth:     "80px",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <><Sun size={14} strokeWidth={1.8} /><span className="text-xs font-medium">Light</span></>
      ) : (
        <><Moon size={14} strokeWidth={1.8} /><span className="text-xs font-medium">Dark</span></>
      )}
    </button>
  );
}
