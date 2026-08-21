"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addUser } from "@/redux/slices/userSlice";
import { getProfileApi } from "@/api/profileApi";
import EditProfile from "@/components/EditProfile";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProfilePage() {
  const user     = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      getProfileApi()
        .then((u) => dispatch(addUser(u)))
        .catch(() => null);
    }
  }, [user, dispatch]);

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-base)", paddingTop: "60px" }}
      >
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: "var(--text-muted)" }}
          aria-label="Loading profile…"
        />
      </div>
    );
  }

  return (
    <>
      {/* ── Theme toggle banner — visible at top of Profile page only ─── */}
      <div
        className="sticky z-40"
        style={{
          top:          "60px",
          background:   "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Appearance
          </p>
          <div className="flex items-center gap-2.5">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Switch theme
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <EditProfile user={user} />
    </>
  );
}
