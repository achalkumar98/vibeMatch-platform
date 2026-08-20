"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { useAppSelector } from "@/redux/hooks";
import { getChatMessagesApi } from "@/api/chatApi";
import { createSocketConnection } from "@/utils/socket";
import type { ChatMessage } from "@/types";
import type { Socket } from "socket.io-client";

export default function ChatPage() {
  const params = useParams();
  const targetUserId = params.targetUserId as string;

  const user = useAppSelector((state) => state.user);
  const userId = user?._id;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTargetOnline, setIsTargetOnline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch message history
  useEffect(() => {
    if (!userId) return;
    getChatMessagesApi(targetUserId)
      .then(setMessages)
      .catch((err) => console.error("fetchMessages error:", err));
  }, [userId, targetUserId]);

  // Socket setup
  useEffect(() => {
    if (!userId) return;

    const s = createSocketConnection();
    setSocket(s);

    s.emit("joinChat", { userId, targetUserId });

    s.on(
      "messageReceived",
      ({
        senderId,
        firstName,
        lastName,
        text,
      }: Omit<ChatMessage, "createdAt">) => {
        setMessages((prev) => [
          ...prev,
          { senderId, firstName, lastName, text, createdAt: new Date() },
        ]);
      }
    );

    s.on(
      "userStatus",
      ({
        userId: changedUserId,
        isOnline,
      }: {
        userId: string;
        isOnline: boolean;
      }) => {
        if (changedUserId === targetUserId) setIsTargetOnline(isOnline);
      }
    );

    return () => {
      s.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    socket.emit("sendMessage", { userId, targetUserId, text: newMessage });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto my-4 h-[calc(100vh-8rem)] bg-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-900 text-white flex justify-between items-center">
        <span className="font-semibold">Chat</span>
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              isTargetOnline ? "bg-green-500" : "bg-gray-500"
            }`}
          />
          <span className="text-sm text-gray-300">
            {isTargetOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === userId;
          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[70%] break-words">
                {!isMe && (
                  <div className="text-sm text-gray-300 mb-1">
                    {msg.firstName} {msg.lastName}
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isMe ? "bg-indigo-600" : "bg-gray-700"
                  } text-white`}
                >
                  {msg.text}
                </div>
                <div
                  className={`text-xs text-gray-400 mt-1 ${
                    isMe ? "text-right" : "text-left"
                  }`}
                >
                  {dayjs(msg.createdAt).format("HH:mm, MMM D")}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex p-4 border-t border-gray-700 bg-gray-900 gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
