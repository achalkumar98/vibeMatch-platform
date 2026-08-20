import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import type { User } from "@/types";

export interface LoginPayload {
  emailId: string;
  password: string;
}

/**
 * POST /api/login
 * Returns the authenticated user object on success.
 * The backend sets an HTTP-only session cookie.
 */
export const loginApi = async (payload: LoginPayload): Promise<User> => {
  const res = await axios.post<User>(
    `${BASE_URL}/api/login`,
    payload,
    { withCredentials: true }
  );
  return res.data;
};
