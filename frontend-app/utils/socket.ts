import { io, Socket } from "socket.io-client";
import { BASE_URL } from "./constants";

/**
 * Creates and returns a new Socket.IO connection.
 * Call this inside a useEffect in a 'use client' component.
 * Always call socket.disconnect() on cleanup.
 */
export const createSocketConnection = (): Socket => {
  return io(BASE_URL, {
    withCredentials: true,     // send auth cookies
    transports: ["websocket"], // skip long-polling
  });
};
