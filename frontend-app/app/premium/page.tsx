"use client";

import { useEffect, useState } from "react";
import { verifyPremiumApi, createPaymentOrderApi } from "@/api/paymentApi";
import type { MembershipType, RazorpayOptions } from "@/types";

interface PlanConfig {
  title: string;
  membershipType: MembershipType;
  price: string;
  period: string;
  benefits: string[];
  isPopular?: boolean;
  accent: string;
}

const PLANS: PlanConfig[] = [
  {
    title: "Silver",
    membershipType: "silver",
    price: "₹149",
    period: "3 months",
    benefits: ["Free chat", "100 connection requests", "Blue tick verification"],
    accent: "rgba(148,163,184,0.15)",
  },
  {
    title: "Gold",
    membershipType: "gold",
    price: "₹199",
    period: "9 months",
    benefits: ["Free chat", "300 connection requests", "Blue tick verification", "Priority in feed"],
    isPopular: true,
    accent: "rgba(245,158,11,0.15)",
  },
  {
    title: "Diamond",
    membershipType: "diamond",
    price: "₹499",
    period: "12 months",
    benefits: [
      "Free chat",
      "Unlimited connection requests",
      "Blue tick verification",
      "Priority in feed",
      "Premium support",
    ],
    accent: "rgba(99,102,241,0.15)",
  },
];

export default function PremiumPage() {
  const [isUserPremium, setIsUserPremium] = useState(false);

  useEffect(() => {
    verifyPremiumApi()
      .then(setIsUserPremium)
      .catch(() => null);
  }, []);

  const handleBuy = async (membershipType: MembershipType) => {
    if (isUserPremium) return;
    try {
      const order = await createPaymentOrderApi(membershipType);
      const { amount, keyId, currency, notes, orderId } = order;

      const options: RazorpayOptions = {
        key: keyId,
        amount,
        currency,
        name: "VibeMatch",
        description: "Connect with developers",
        order_id: orderId,
        prefill: { name: `${notes.firstName} ${notes.lastName}`, email: notes.emailId, contact: "9999999999" },
        theme: { color: "#ffffff" },
        handler: () => {
          verifyPremiumApi().then(setIsUserPremium).catch(() => null);
        },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black" style={{ paddingTop: "56px" }}>
      <div className="max-w-5xl mx-auto px-5 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Unlock Premium
          </h1>
          <p className="text-white/40 text-base max-w-md mx-auto">
            More connections, exclusive features, and priority placement in the developer feed.
          </p>
          {isUserPremium && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-5 text-sm font-medium"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac" }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400" />
              You are a Premium member
            </div>
          )}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map(({ title, membershipType, price, period, benefits, isPopular, accent }) => (
            <div
              key={membershipType}
              className="relative flex flex-col rounded-2xl p-6"
              style={{
                background: accent,
                border: `1px solid ${isPopular ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.07)"}`,
                boxShadow: isPopular ? "0 0 40px rgba(245,158,11,0.08)" : "none",
              }}
            >
              {isPopular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "#f59e0b", color: "#000" }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-white mb-1">{title}</h2>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-white">{price}</span>
                  <span className="text-white/40 text-sm">/ {period}</span>
                </div>
              </div>

              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy(membershipType)}
                disabled={isUserPremium}
                className={`vm-btn w-full py-2.5 ${
                  isPopular ? "vm-btn-white" : "vm-btn-outline"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isUserPremium ? "Current plan" : `Get ${title}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
