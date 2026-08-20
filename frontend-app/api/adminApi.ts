import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import type { AdminAnalytics, AdminUsersResponse, AdminUser } from "@/types";

const base = `${BASE_URL}/api/admin`;
const opts = { withCredentials: true };

export const getAdminAnalyticsApi = async (
  days = 30
): Promise<AdminAnalytics> => {
  const res = await axios.get<AdminAnalytics>(`${base}/analytics`, {
    params: { days },
    ...opts,
  });
  return res.data;
};

export const getAdminUsersApi = async (
  page = 1,
  limit = 20,
  search = ""
): Promise<AdminUsersResponse> => {
  const res = await axios.get<AdminUsersResponse>(`${base}/users`, {
    params: { page, limit, search },
    ...opts,
  });
  return res.data;
};

export const banUserApi = async (
  userId: string,
  isBanned: boolean
): Promise<AdminUser> => {
  const res = await axios.patch<{ data: AdminUser }>(
    `${base}/users/${userId}/ban`,
    { isBanned },
    opts
  );
  return res.data.data;
};

export const getReportedProfilesApi = async (): Promise<AdminUser[]> => {
  const res = await axios.get<{ data: AdminUser[] }>(`${base}/reported`, opts);
  return res.data.data;
};
