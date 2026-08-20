import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import type { MembershipType, RazorpayOrderResponse } from "@/types";

/**
 * GET /api/premium/verify
 * Returns whether the current user has an active premium membership.
 */
export const verifyPremiumApi = async (): Promise<boolean> => {
  const res = await axios.get<{ isPremium: boolean }>(
    `${BASE_URL}/api/premium/verify`,
    { withCredentials: true }
  );
  return res.data.isPremium ?? false;
};

/**
 * POST /api/payment/create
 * Creates a Razorpay order for the given membership type.
 * Returns the order details needed to open the Razorpay checkout.
 */
export const createPaymentOrderApi = async (
  membershipType: MembershipType
): Promise<RazorpayOrderResponse> => {
  const res = await axios.post<RazorpayOrderResponse>(
    `${BASE_URL}/api/payment/create`,
    { membershipType },
    { withCredentials: true }
  );
  return res.data;
};
