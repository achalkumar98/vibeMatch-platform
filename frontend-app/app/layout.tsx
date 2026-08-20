import type { Metadata } from "next";
import Script from "next/script";
import StoreProvider from "@/redux/StoreProvider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeMatch – Connect with Developers",
  description:
    "Swipe, connect and chat with developers around the world on VibeMatch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen bg-gray-900 text-gray-100 antialiased">
        {/* Razorpay SDK loaded from CDN — required for payment checkout */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <StoreProvider>
          {/* Fixed top navbar */}
          <NavBar />

          {/* Page content — pt accounts for the fixed navbar height */}
          <main className="flex-grow pt-16 px-4 sm:px-6 md:px-8 lg:px-16 transition-all duration-300">
            {children}
          </main>

          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
