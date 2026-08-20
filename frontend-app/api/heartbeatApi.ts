import axios from "axios";
import { BASE_URL } from "@/utils/constants";

/**
 * POST /api/heartbeat
 * Updates the user's lastSeen timestamp on the backend.
 * Call every ~30 s while the user is active.
 */
export const sendHeartbeatApi = async (): Promise<void> => {
  await axios.post(
    `${BASE_URL}/api/heartbeat`,
    {},
    { withCredentials: true }
  );
};
