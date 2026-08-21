import axios from "axios";
import { API_URL } from "@/utils/constants";
import type { FeedResponse } from "@/types";

/**
 * GET /api/feed
 * Supports cursor-based pagination. Pass cursor = last returned _id.
 * Returns { users, nextCursor, hasMore }.
 */
export const getFeedApi = async (
  cursor?: string | null,
  limit = 10
): Promise<FeedResponse> => {
  const params: Record<string, string | number> = { limit };
  if (cursor) params.cursor = cursor;

  const res = await axios.get<FeedResponse>(`${API_URL}/feed`, {
    params,
    withCredentials: true,
  });
  return res.data;
};
