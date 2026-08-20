"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import type { AppStore } from "./store";

// Re-export AppStore type so layout can reference it if needed
export type { AppStore };

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useRef ensures we only create the store instance once
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = store;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
