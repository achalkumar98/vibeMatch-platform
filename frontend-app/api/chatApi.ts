import axios from "axios";
import { API_URL } from "@/utils/constants";
import type { ChatMessage } from "@/types";

interface RawMessage {
  senderId: { _id: string; firstName: string; lastName: string };
  text: string;
  createdAt: string;
}

interface ChatResponse {
  messages: RawMessage[];
}

/**
 * GET /api/chat/:targetUserId
 * Fetches the message history between the current user and targetUserId.
 * Maps the raw backend response to a flat ChatMessage shape.
 */
export const getChatMessagesApi = async (
  targetUserId: string
): Promise<ChatMessage[]> => {
  const res = await axios.get<ChatResponse>(
    `${API_URL}/chat/${targetUserId}`,
    { withCredentials: true }
  );

  return res.data.messages.map((msg) => ({
    senderId: msg.senderId?._id,
    firstName: msg.senderId?.firstName,
    lastName: msg.senderId?.lastName,
    text: msg.text,
    createdAt: msg.createdAt,
  }));
};
