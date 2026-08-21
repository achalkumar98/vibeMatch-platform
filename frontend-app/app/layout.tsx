import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/redux/StoreProvider";
import ThemeProvider from "@/components/ThemeProvider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeartbeatProvider from "@/components/HeartbeatProvider";
import ToastWrapper from "@/components/ToastWrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VibeMatch – Connect with Developers",
  description:
    "Swipe, connect and chat with developers around the world on VibeMatch.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className="flex flex-col min-h-screen antialiased"
        style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <ThemeProvider>
          <StoreProvider>
            <HeartbeatProvider />
            <NavBar />

            {/*
              ToastWrapper reads the current theme and renders react-hot-toast's
              <Toaster> with matching styles. It must be inside ThemeProvider.
            */}
            <ToastWrapper />

            <main className="flex-grow">{children}</main>
            <Footer />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
