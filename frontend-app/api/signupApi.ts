import axios from "axios";
import { API_URL } from "@/utils/constants";
import type { User, ApiResponse } from "@/types";

export interface SignupPayload {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
}

/**
 * POST /api/signup
 * Returns the newly created user wrapped in { data: User }.
 * The backend sets an HTTP-only session cookie.
 */
export const signupApi = async (payload: SignupPayload): Promise<User> => {
  const res = await axios.post<ApiResponse<User>>(
    `${API_URL}/signup`,
    payload,
    { withCredentials: true }
  );
  return res.data.data;
};
