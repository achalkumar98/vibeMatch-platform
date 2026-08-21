"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={["dark", "light"]}
      // next-themes sets `class="dark"` or `class="light"` on <html>
      // which matches our CSS custom-property selectors html.dark / html.light
    >
      {children}
    </NextThemesProvider>
  );
}
