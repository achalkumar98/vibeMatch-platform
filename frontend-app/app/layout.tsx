import type { Metadata } from "next";
import Script from "next/script";
import StoreProvider from "@/redux/StoreProvider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeartbeatProvider from "@/components/HeartbeatProvider";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen bg-black text-gray-100 antialiased">
        {/* Razorpay SDK — loaded lazily, only needed on /premium */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <StoreProvider>
          {/* Heartbeat: keeps lastSeen fresh while user is logged in */}
          <HeartbeatProvider />

          {/* Fixed minimal top navbar */}
          <NavBar />

          {/* Page content — pt-16 clears the fixed 64 px navbar */}
          <main className="flex-grow">
            {children}
          </main>

          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
