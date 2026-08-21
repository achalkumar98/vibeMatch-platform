"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { sendHeartbeatApi } from "@/api/heartbeatApi";

/**
 * Invisible component — mounts in the root layout.
 * While a user is logged in, sends a heartbeat every 30 s to keep
 * their lastSeen timestamp fresh on the backend.
 */
export default function HeartbeatProvider() {
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user) return;

    // Fire immediately on login / page load
    sendHeartbeatApi().catch(() => null);

    const interval = setInterval(() => {
      sendHeartbeatApi().catch(() => null);
    }, 30_000);

    return () => clearInterval(interval);
  }, [user]); // re-run only when the logged-in user changes

  return null;
}
