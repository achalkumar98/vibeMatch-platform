import axios from "axios";
import { API_URL } from "@/utils/constants";

/**
 * POST /api/heartbeat
 * Updates the user's lastSeen timestamp on the backend.
 * Call every ~30 s while the user is active.
 */
export const sendHeartbeatApi = async (): Promise<void> => {
  await axios.post(
    `${API_URL}/heartbeat`,
    {},
    { withCredentials: true }
  );
};
