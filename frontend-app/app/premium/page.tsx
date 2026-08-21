"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, Gem, Shield, Crown, BadgeCheck } from "lucide-react";
import { verifyPremiumApi, createPaymentOrderApi } from "@/api/paymentApi";
import type { MembershipType, RazorpayOptions } from "@/types";

interface PlanConfig {
  title: string;
  membershipType: MembershipType;
  price: string;
  period: string;
  benefits: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
  accentColor: string;
}

const PLANS: PlanConfig[] = [
  {
    title: "Silver",
    membershipType: "silver",
    price: "₹149",
    period: "3 months",
    icon: <Shield size={20} strokeWidth={1.8} />,
    accentColor: "#94a3b8",
    benefits: [
      "Free unlimited chat",
      "100 connection requests",
      "Blue tick verification",
    ],
  },
  {
    title: "Gold",
    membershipType: "gold",
    price: "₹199",
    period: "9 months",
    icon: <Crown size={20} strokeWidth={1.8} />,
    accentColor: "#f59e0b",
    isPopular: true,
    benefits: [
      "Free unlimited chat",
      "300 connection requests",
      "Blue tick verification",
      "Priority placement in feed",
    ],
  },
  {
    title: "Diamond",
    membershipType: "diamond",
    price: "₹499",
    period: "12 months",
    icon: <Gem size={20} strokeWidth={1.8} />,
    accentColor: "#8b5cf6",
    benefits: [
      "Free unlimited chat",
      "Unlimited connection requests",
      "Blue tick verification",
      "Priority placement in feed",
      "Dedicated premium support",
    ],
  },
];

export default function PremiumPage() {
  const [isUserPremium, setIsUserPremium] = useState(false);

  useEffect(() => {
    verifyPremiumApi().then(setIsUserPremium).catch(() => null);
  }, []);

  const handleBuy = async (membershipType: MembershipType) => {
    if (isUserPremium) return;
    const id = toast.loading("Preparing checkout…");
    try {
      const order = await createPaymentOrderApi(membershipType);
      toast.dismiss(id);
      const { amount, keyId, currency, notes, orderId } = order;
      const options: RazorpayOptions = {
        key: keyId,
        amount,
        currency,
        name: "VibeMatch",
        description: "Connect with developers",
        order_id: orderId,
        prefill: {
          name:    `${notes.firstName} ${notes.lastName}`,
          email:   notes.emailId,
          contact: "9999999999",
        },
        theme: { color: "#6366f1" },
        handler: () => {
          verifyPremiumApi()
            .then((premium) => {
              setIsUserPremium(premium);
              if (premium) toast.success("🎉 Welcome to Premium!");
            })
            .catch(() => null);
        },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Could not initiate payment. Please try again.", { id });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", paddingTop: "56px" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5"
            style={{ background: "var(--brand-subtle)", color: "var(--brand)" }}
            aria-hidden
          >
            <Gem size={22} strokeWidth={1.8} />
          </div>
          <h1
            className="font-bold tracking-tight mb-3"
            style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", color: "var(--text-primary)" }}
          >
            Unlock Premium
          </h1>
          <p
            className="text-base max-w-md mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            More connections, exclusive features, and priority placement in the developer feed.
          </p>

          {isUserPremium && (
            <div className="inline-flex items-center gap-2 vm-badge vm-badge-success mt-5 px-4 py-2 text-sm">
              <BadgeCheck size={14} strokeWidth={2} aria-hidden />
              You are a Premium member
            </div>
          )}
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" role="list" aria-label="Premium plans">
          {PLANS.map(({ title, membershipType, price, period, benefits, isPopular, icon, accentColor }) => (
            <article
              key={membershipType}
              role="listitem"
              className="relative flex flex-col rounded-2xl p-6"
              style={{
                background: "var(--bg-surface)",
                border:     `1px solid ${isPopular ? accentColor + "55" : "var(--border)"}`,
                boxShadow:  isPopular ? `0 0 40px ${accentColor}18` : "none",
              }}
            >
              {isPopular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: accentColor, color: "#000" }}
                >
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${accentColor}1a`, color: accentColor, border: `1px solid ${accentColor}30` }}
                aria-hidden
              >
                {icon}
              </div>

              <div className="mb-4">
                <h2 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  {title}
                </h2>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-3xl font-bold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {price}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    / {period}
                  </span>
                </div>
              </div>

              <ul className="flex flex-col gap-2.5 mb-6 flex-1" aria-label={`${title} plan benefits`}>
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      className="shrink-0 mt-0.5"
                      style={{ color: "var(--success)" }}
                      aria-hidden
                    />
                    {b}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy(membershipType)}
                disabled={isUserPremium}
                className={`vm-btn w-full py-2.5 ${isPopular ? "vm-btn-primary" : "vm-btn-outline"}`}
                aria-label={`${isUserPremium ? "Already subscribed" : `Subscribe to ${title}`}`}
              >
                {isUserPremium ? "Current plan" : `Get ${title}`}
              </button>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
