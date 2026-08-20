import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import type { FeedUser } from "@/types";

/**
 * GET /api/feed
 * Returns an array of users to display in the swipe feed.
 * Only users that haven't been swiped on yet are returned.
 */
export const getFeedApi = async (): Promise<FeedUser[]> => {
  const res = await axios.get<FeedUser[]>(
    `${BASE_URL}/api/feed`,
    { withCredentials: true }
  );
  return res.data;
};
