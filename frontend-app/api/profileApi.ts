import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import type { User, ApiResponse } from "@/types";

export interface EditProfilePayload {
  firstName: string;
  lastName: string;
  photoUrl?: string;
  age: number | string;
  gender: string;
  about?: string;
  skills?: string[];
}

/**
 * GET /api/profile/view
 * Returns the current logged-in user's profile.
 * Throws 401 if the session cookie is invalid/missing.
 */
export const getProfileApi = async (): Promise<User> => {
  const res = await axios.get<User>(
    `${BASE_URL}/api/profile/view`,
    { withCredentials: true }
  );
  return res.data;
};

/**
 * PUT /api/profile/edit
 * Updates the current user's profile.
 * Returns the updated user wrapped in { data: User }.
 */
export const editProfileApi = async (
  payload: EditProfilePayload
): Promise<User> => {
  const res = await axios.put<ApiResponse<User>>(
    `${BASE_URL}/api/profile/edit`,
    payload,
    { withCredentials: true }
  );
  return res.data.data;
};

/**
 * POST /api/logout
 * Clears the session cookie on the backend.
 */
export const logoutApi = async (): Promise<void> => {
  await axios.post(
    `${BASE_URL}/api/logout`,
    {},
    { withCredentials: true }
  );
};
