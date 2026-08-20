import axios from "axios";
import { BASE_URL } from "@/utils/constants";

export type SendRequestStatus = "interested" | "ignored";
export type ReviewRequestStatus = "accepted" | "rejected";

/**
 * POST /api/request/send/:status/:userId
 * Sends an interested or ignored request to a user from the feed.
 */
export const sendRequestApi = async (
  status: SendRequestStatus,
  userId: string
): Promise<void> => {
  await axios.post(
    `${BASE_URL}/api/request/send/${status}/${userId}`,
    {},
    { withCredentials: true }
  );
};

/**
 * POST /api/request/review/:status/:requestId
 * Accepts or rejects an incoming connection request.
 */
export const reviewRequestApi = async (
  status: ReviewRequestStatus,
  requestId: string
): Promise<void> => {
  await axios.post(
    `${BASE_URL}/api/request/review/${status}/${requestId}`,
    {},
    { withCredentials: true }
  );
};
