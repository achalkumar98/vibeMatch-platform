import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import StoreProvider from "@/redux/StoreProvider";
import ThemeProvider from "@/components/ThemeProvider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeartbeatProvider from "@/components/HeartbeatProvider";
import ToastWrapper from "@/components/ToastWrapper";
import "./globals.css";
import "./responsive.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VibeMatch – Swipe Into Your Next Dev Circle",
  description:
    "Swipe, connect and chat with developers around the world on VibeMatch.",
  icons: {
    icon:  "/assets/vibeMatch-logo.png",
    apple: "/assets/vibeMatch-logo.png",
  },
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
            {/* theme-aware react-hot-toast */}
            <ToastWrapper />
            <main className="flex-grow">{children}</main>
            <Footer />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
