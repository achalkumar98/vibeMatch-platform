"use client";

/**
 * ToastWrapper
 * Renders react-hot-toast's <Toaster> inside the ThemeProvider so it can
 * read the current theme and apply matching styles automatically.
 */
import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ToastWrapper() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid SSR mismatch — only render after hydration
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Toaster
      position="bottom-center"
      gutter={10}
      containerStyle={{ zIndex: 9999, bottom: 24 }}
      toastOptions={{
        duration: 3500,

        // ── Base style applied to ALL toasts ──────────────────────────────
        style: {
          background:  isDark ? "#1a1a1a" : "#ffffff",
          color:       isDark ? "#f3f4f6" : "#0f0f0f",
          border:      `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"}`,
          borderRadius: "10px",
          fontSize:    "13.5px",
          fontFamily:  "Inter, -apple-system, sans-serif",
          fontWeight:  "500",
          padding:     "10px 14px",
          boxShadow:   isDark
            ? "0 8px 30px rgba(0,0,0,0.55)"
            : "0 8px 30px rgba(0,0,0,0.12)",
          maxWidth:    "360px",
        },

        // ── Success overrides ─────────────────────────────────────────────
        success: {
          iconTheme: {
            primary:    "#22c55e",
            secondary:  isDark ? "#1a1a1a" : "#ffffff",
          },
          style: {
            background: isDark ? "#0f1f13" : "#f0fdf4",
            color:      isDark ? "#86efac" : "#15803d",
            border:     `1px solid ${isDark ? "rgba(34,197,94,0.25)" : "rgba(34,197,94,0.35)"}`,
          },
        },

        // ── Error overrides ───────────────────────────────────────────────
        error: {
          iconTheme: {
            primary:    "#ef4444",
            secondary:  isDark ? "#1a1a1a" : "#ffffff",
          },
          style: {
            background: isDark ? "#1f0f0f" : "#fef2f2",
            color:      isDark ? "#fca5a5" : "#b91c1c",
            border:     `1px solid ${isDark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.35)"}`,
          },
        },

        // ── Loading overrides ─────────────────────────────────────────────
        loading: {
          iconTheme: {
            primary:   isDark ? "#6366f1" : "#4f46e5",
            secondary: isDark ? "#3b3b54" : "#e0e7ff",
          },
        },
      }}
    />
  );
}
