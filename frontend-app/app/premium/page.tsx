"use client";

import { useEffect, useState } from "react";
import { verifyPremiumApi, createPaymentOrderApi } from "@/api/paymentApi";
import type { MembershipType, RazorpayOptions } from "@/types";

interface PlanConfig {
  title: string;
  membershipType: MembershipType;
  price: string;
  benefits: string[];
  gradient: string;
  isPopular?: boolean;
}

const PLANS: PlanConfig[] = [
  {
    title: "Silver",
    membershipType: "silver",
    price: "₹149",
    benefits: [
      "Valid for 3 months",
      "Free chat",
      "100 connection requests",
      "Blue tick",
    ],
    gradient: "bg-gradient-to-b from-gray-700 to-gray-800",
  },
  {
    title: "Gold",
    membershipType: "gold",
    price: "₹199",
    benefits: [
      "Valid for 9 months",
      "Free chat",
      "300 connection requests",
      "Blue tick",
    ],
    gradient: "bg-gradient-to-b from-yellow-600 to-yellow-700",
    isPopular: true,
  },
  {
    title: "Diamond",
    membershipType: "diamond",
    price: "₹499",
    benefits: [
      "Valid for 12 months",
      "Free chat",
      "Infinite connection requests",
      "Blue tick",
      "Premium support",
    ],
    gradient: "bg-gradient-to-b from-cyan-600 to-cyan-700",
  },
];

export default function PremiumPage() {
  const [isUserPremium, setIsUserPremium] = useState(false);

  useEffect(() => {
    verifyPremiumApi()
      .then(setIsUserPremium)
      .catch((err) => console.error("Error verifying premium:", err));
  }, []);

  const handleBuyClick = async (membershipType: MembershipType) => {
    if (isUserPremium) return;
    try {
      const order = await createPaymentOrderApi(membershipType);
      const { amount, keyId, currency, notes, orderId } = order;

      const options: RazorpayOptions = {
        key: keyId,
        amount,
        currency,
        name: "VibeMatch",
        description: "Connect with other developers",
        order_id: orderId,
        prefill: {
          name: `${notes.firstName} ${notes.lastName}`,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: { color: "#6366F1" },
        handler: () => {
          verifyPremiumApi().then(setIsUserPremium);
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Error creating payment:", err);
    }
  };

  return (
    <div className="flex flex-wrap gap-6 justify-center m-10 p-6">
      {isUserPremium && (
        <div className="w-full text-center mb-6 text-green-400 font-bold text-xl">
          🎉 You are a Premium Member!
        </div>
      )}

      {PLANS.map(
        ({ title, membershipType, price, benefits, gradient, isPopular }) => (
          <div
            key={membershipType}
            className={`w-full max-w-sm rounded-2xl shadow-lg overflow-hidden border border-gray-700 flex flex-col text-white transform transition hover:scale-105 ${gradient}`}
          >
            <div className="flex-1 flex flex-col justify-between p-6">
              <div>
                {isPopular && (
                  <span className="inline-block px-3 py-1 mb-3 text-sm font-semibold rounded-full bg-yellow-400 text-gray-900">
                    Most Popular
                  </span>
                )}
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">{title}</h2>
                  <span className="text-xl font-semibold">{price}</span>
                </div>
                <ul className="mt-6 flex flex-col gap-3 text-sm">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-400 font-bold">✔️</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleBuyClick(membershipType)}
                disabled={isUserPremium}
                className={`btn btn-primary btn-block mt-6 py-3 rounded-lg font-semibold ${
                  isUserPremium
                    ? "bg-gray-600 cursor-not-allowed hover:bg-gray-600"
                    : ""
                }`}
              >
                {isUserPremium ? "Already Premium" : "Subscribe"}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
