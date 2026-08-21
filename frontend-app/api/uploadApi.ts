import axios from "axios";
import { API_URL } from "@/utils/constants";

/**
 * POST /api/upload/photo
 * Uploads a profile photo to Cloudinary via the backend.
 * Returns the secure Cloudinary URL.
 */
export const uploadPhotoApi = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("photo", file);

  const res = await axios.post<{ photoUrl: string }>(
    `${API_URL}/upload/photo`,
    formData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data.photoUrl;
};
