"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAppSelector } from "@/redux/hooks";
import { getChatMessagesApi } from "@/api/chatApi";
import { createSocketConnection } from "@/utils/socket";
import type { ChatMessage } from "@/types";
import type { Socket } from "socket.io-client";

dayjs.extend(relativeTime);

function formatLastSeen(lastSeen: string | null | undefined): string {
  if (!lastSeen) return "Offline";
  const diff = Date.now() - new Date(lastSeen).getTime();
  if (diff < 2 * 60 * 1000) return "Online";
  return `Last seen ${dayjs(lastSeen).fromNow()}`;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const targetUserId = params.targetUserId as string;

  const user = useAppSelector((state) => state.user);
  const userId = user?._id;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTargetOnline, setIsTargetOnline] = useState(false);
  const [targetLastSeen, setTargetLastSeen] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load history
  useEffect(() => {
    if (!userId) return;
    getChatMessagesApi(targetUserId)
      .then(setMessages)
      .catch((err) => console.error("fetchMessages error:", err));
  }, [userId, targetUserId]);

  // Socket
  useEffect(() => {
    if (!userId) return;

    const s = createSocketConnection();
    setSocket(s);
    s.emit("joinChat", { userId, targetUserId });

    s.on("messageReceived", ({ senderId, firstName, lastName, text, createdAt }: ChatMessage) => {
      setMessages((prev) => [...prev, { senderId, firstName, lastName, text, createdAt }]);
    });

    s.on("userStatus", ({ userId: uid, isOnline, lastSeen }: { userId: string; isOnline: boolean; lastSeen?: string }) => {
      if (uid === targetUserId) {
        setIsTargetOnline(isOnline);
        if (lastSeen) setTargetLastSeen(lastSeen);
      }
    });

    // Heartbeat over socket every 30 s
    const hb = setInterval(() => s.emit("heartbeat", { userId }), 30_000);

    return () => {
      clearInterval(hb);
      s.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    socket.emit("sendMessage", { userId, targetUserId, text: newMessage });
    setNewMessage("");
  };

  const statusLabel = isTargetOnline ? "Online" : formatLastSeen(targetLastSeen);

  return (
    <div className="flex flex-col bg-black" style={{ height: "100vh", paddingTop: "56px" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background: "rgba(0,0,0,0.9)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="text-white/40 hover:text-white/70 transition-colors mr-1"
          aria-label="Back"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10">
              <div className="w-full h-full" />
            </div>
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-black"
              style={{ background: isTargetOnline ? "#22c55e" : "#555" }}
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white">Chat</div>
            <div
              className="text-xs"
              style={{ color: isTargetOnline ? "#86efac" : "rgba(255,255,255,0.3)" }}
            >
              {statusLabel}
            </div>
          </div>
        </div>

        <Link
          href="/connections"
          className="text-xs text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
        >
          Connections
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-white/20 text-sm mt-10">
            No messages yet. Say hello! 👋
          </p>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.senderId === userId;
          return (
            <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-white/10 mr-2 flex-shrink-0 self-end" />
              )}
              <div className="max-w-[70%]">
                {!isMe && (
                  <p className="text-xs text-white/30 mb-1">
                    {msg.firstName} {msg.lastName}
                  </p>
                )}
                <div
                  className="px-3.5 py-2 rounded-2xl text-sm break-words"
                  style={{
                    background: isMe ? "#fff" : "rgba(255,255,255,0.07)",
                    color: isMe ? "#000" : "#fff",
                    borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  }}
                >
                  {msg.text}
                </div>
                <p className={`text-xs text-white/20 mt-1 ${isMe ? "text-right" : "text-left"}`}>
                  {dayjs(msg.createdAt).format("HH:mm")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background: "rgba(0,0,0,0.9)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <input
          type="text"
          className="vm-input flex-1"
          placeholder="Type a message…"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          aria-label="Message input"
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="vm-btn vm-btn-white px-4 py-2 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
