"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronLeft, Send, Circle } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAppSelector } from "@/redux/hooks";
import { getChatMessagesApi } from "@/api/chatApi";
import { createSocketConnection } from "@/utils/socket";
import type { ChatMessage } from "@/types";
import type { Socket } from "socket.io-client";

dayjs.extend(relativeTime);

function formatStatus(isOnline: boolean, lastSeen: string | null): string {
  if (isOnline) return "Online";
  if (!lastSeen) return "Offline";
  const diff = Date.now() - new Date(lastSeen).getTime();
  if (diff < 2 * 60_000) return "Online";
  return `Last seen ${dayjs(lastSeen).fromNow()}`;
}

export default function ChatPage() {
  const params       = useParams();
  const router       = useRouter();
  const targetUserId = params.targetUserId as string;

  const user   = useAppSelector((s) => s.user);
  const userId = user?._id;

  const [messages,       setMessages]       = useState<ChatMessage[]>([]);
  const [newMessage,     setNewMessage]      = useState("");
  const [socket,         setSocket]          = useState<Socket | null>(null);
  const [isTargetOnline, setIsTargetOnline]  = useState(false);
  const [targetLastSeen, setTargetLastSeen]  = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!userId) return;
    getChatMessagesApi(targetUserId)
      .then(setMessages)
      .catch((err) => {
        console.error("fetchMessages error:", err);
        toast.error("Could not load message history.");
      });
  }, [userId, targetUserId]);

  useEffect(() => {
    if (!userId) return;

    const s = createSocketConnection();
    setSocket(s);
    s.emit("joinChat", { userId, targetUserId });

    s.on("messageReceived", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on("userStatus", ({
      userId: uid,
      isOnline,
      lastSeen,
    }: { userId: string; isOnline: boolean; lastSeen?: string }) => {
      if (uid === targetUserId) {
        setIsTargetOnline(isOnline);
        if (lastSeen) setTargetLastSeen(lastSeen);
      }
    });

    const hb = setInterval(() => s.emit("heartbeat", { userId }), 30_000);

    return () => {
      clearInterval(hb);
      s.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    if (!socket.connected) {
      toast.error("Connection lost. Reconnecting…");
      return;
    }
    socket.emit("sendMessage", { userId, targetUserId, text: newMessage });
    setNewMessage("");
  };

  const statusText = formatStatus(isTargetOnline, targetLastSeen);

  return (
    <div
      className="flex flex-col"
      style={{
        height:     "100vh",
        paddingTop: "56px",
        background: "var(--bg-base)",
      }}
    >
      {/* ── Chat header ──────────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          background:     "var(--bg-surface)",
          borderBottom:   "1px solid var(--border)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="vm-btn vm-btn-ghost w-8 h-8 p-0 rounded-lg"
          aria-label="Go back"
        >
          <ChevronLeft size={16} strokeWidth={2} aria-hidden />
        </button>

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="relative shrink-0">
            <div
              className="w-8 h-8 rounded-full"
              style={{ background: "var(--bg-elevated)" }}
              aria-hidden
            />
            <Circle
              size={10}
              className="absolute bottom-0 right-0 fill-current"
              style={{
                color:       isTargetOnline ? "var(--success)" : "var(--text-disabled)",
                stroke:      "var(--bg-surface)",
                strokeWidth: 2,
              }}
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Chat
            </div>
            <div
              className="text-xs font-medium"
              style={{ color: isTargetOnline ? "var(--success)" : "var(--text-muted)" }}
              aria-live="polite"
            >
              {statusText}
            </div>
          </div>
        </div>

        <Link
          href="/connections"
          className="vm-btn vm-btn-ghost text-xs px-3 py-1.5 shrink-0"
        >
          Connections
        </Link>
      </header>

      {/* ── Messages ─────────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <p
            className="text-center text-sm mt-10"
            style={{ color: "var(--text-muted)" }}
          >
            No messages yet. Say hello! 👋
          </p>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.senderId === userId;
          return (
            <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <div
                  className="w-7 h-7 rounded-full mr-2 shrink-0 self-end"
                  style={{ background: "var(--bg-elevated)" }}
                  aria-hidden
                />
              )}
              <div className={`max-w-[72%] ${isMe ? "" : ""}`}>
                {!isMe && (
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                    {msg.firstName} {msg.lastName}
                  </p>
                )}
                <div
                  className="px-3.5 py-2 text-sm break-words"
                  style={{
                    background:   isMe ? "var(--brand)" : "var(--bg-elevated)",
                    color:        isMe ? "#fff" : "var(--text-primary)",
                    borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    border:       isMe ? "none" : "1px solid var(--border)",
                  }}
                >
                  {msg.text}
                </div>
                <p
                  className={`text-xs mt-1 ${isMe ? "text-right" : "text-left"}`}
                  style={{ color: "var(--text-disabled)" }}
                  aria-label={`Sent at ${dayjs(msg.createdAt).format("HH:mm")}`}
                >
                  {dayjs(msg.createdAt).format("HH:mm")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          background:   "var(--bg-surface)",
          borderTop:    "1px solid var(--border)",
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
          className="vm-btn vm-btn-primary w-10 h-10 p-0 rounded-xl shrink-0"
          aria-label="Send message"
        >
          <Send size={15} strokeWidth={1.8} aria-hidden />
        </button>
      </div>
    </div>
  );
}
