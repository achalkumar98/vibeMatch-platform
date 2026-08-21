import axios from "axios";
import { API_URL } from "@/utils/constants";
import type { Connection, ConnectionRequest, ApiResponse } from "@/types";

/**
 * GET /api/user/connections
 * Returns the list of users the current user is connected with.
 */
export const getConnectionsApi = async (): Promise<Connection[]> => {
  const res = await axios.get<ApiResponse<Connection[]>>(
    `${API_URL}/user/connections`,
    { withCredentials: true }
  );
  return res.data.data;
};

/**
 * GET /api/user/requests/received
 * Returns all pending incoming connection requests.
 */
export const getReceivedRequestsApi = async (): Promise<
  ConnectionRequest[]
> => {
  const res = await axios.get<ApiResponse<ConnectionRequest[]>>(
    `${API_URL}/user/requests/received`,
    { withCredentials: true }
  );
  return res.data.data;
};
