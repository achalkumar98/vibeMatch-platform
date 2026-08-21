import axios from "axios";
import { API_URL } from "@/utils/constants";
import type { MembershipType, RazorpayOrderResponse } from "@/types";

/**
 * GET /api/premium/verify
 * Returns whether the current user has an active premium membership.
 */
export const verifyPremiumApi = async (): Promise<boolean> => {
  const res = await axios.get<{ isPremium: boolean }>(
    `${API_URL}/premium/verify`,
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
    `${API_URL}/payment/create`,
    { membershipType },
    { withCredentials: true }
  );
  return res.data;
};
