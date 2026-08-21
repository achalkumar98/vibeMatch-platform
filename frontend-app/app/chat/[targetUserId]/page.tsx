"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Send, Phone, Video, MessageSquare, Smile } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAppSelector } from "@/redux/hooks";
import { getChatMessagesApi } from "@/api/chatApi";
import { createSocketConnection } from "@/utils/socket";
import type { ChatMessage } from "@/types";
import type { Socket } from "socket.io-client";

dayjs.extend(relativeTime);

const NEUTRAL_AVATAR = (seed: string) =>
  `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

function formatStatus(isOnline: boolean, lastSeen: string | null): string {
  if (isOnline) return "Online";
  if (!lastSeen) return "Offline";
  const diff = Date.now() - new Date(lastSeen).getTime();
  if (diff < 2 * 60_000) return "Online";
  return `Last seen ${dayjs(lastSeen).fromNow()}`;
}

/* Group messages by date */
function groupByDate(messages: ChatMessage[]): { date: string; msgs: ChatMessage[] }[] {
  const map = new Map<string, ChatMessage[]>();
  for (const msg of messages) {
    const key = dayjs(msg.createdAt).format("YYYY-MM-DD");
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(msg);
  }
  return Array.from(map.entries()).map(([date, msgs]) => ({ date, msgs }));
}

function dateLabel(dateStr: string): string {
  const today     = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
  if (dateStr === today)     return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return dayjs(dateStr).format("MMM D, YYYY");
}

export default function ChatPage() {
  const params       = useParams();
  const router       = useRouter();
  const targetUserId = params.targetUserId as string;

  const user        = useAppSelector((s) => s.user);
  const connections = useAppSelector((s) => s.connections);
  const userId      = user?._id;

  /* Resolve target user from Redux connections */
  const targetUser = connections?.find((c) => c._id === targetUserId) ?? null;
  const targetName = targetUser
    ? `${targetUser.firstName} ${targetUser.lastName}`
    : "Chat";
  const targetAvatar = targetUser?.photoUrl || NEUTRAL_AVATAR(targetName);

  const [messages,       setMessages]      = useState<ChatMessage[]>([]);
  const [newMessage,     setNewMessage]    = useState("");
  const [socket,         setSocket]        = useState<Socket | null>(null);
  const [isTargetOnline, setIsTargetOnline] = useState(false);
  const [targetLastSeen, setTargetLastSeen] = useState<string | null>(null);
  const [sending,        setSending]       = useState(false);

  const messagesEndRef    = useRef<HTMLDivElement>(null);
  const inputRef          = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  /* Load history */
  useEffect(() => {
    if (!userId) return;
    getChatMessagesApi(targetUserId)
      .then((msgs) => { setMessages(msgs); scrollToBottom("instant"); })
      .catch(() => toast.error("Could not load message history."));
  }, [userId, targetUserId, scrollToBottom]);

  /* Socket */
  useEffect(() => {
    if (!userId) return;
    const s = createSocketConnection();
    setSocket(s);
    s.emit("joinChat", { userId, targetUserId });

    s.on("messageReceived", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on("userStatus", ({ userId: uid, isOnline, lastSeen }: {
      userId: string; isOnline: boolean; lastSeen?: string;
    }) => {
      if (uid === targetUserId) {
        setIsTargetOnline(isOnline);
        if (lastSeen) setTargetLastSeen(lastSeen);
      }
    });

    const hb = setInterval(() => s.emit("heartbeat", { userId }), 30_000);
    return () => { clearInterval(hb); s.disconnect(); };
  }, [userId, targetUserId]);

  const sendMessage = useCallback(() => {
    const text = newMessage.trim();
    if (!text || !socket || sending) return;
    if (!socket.connected) { toast.error("Connection lost. Reconnecting…"); return; }
    setSending(true);
    socket.emit("sendMessage", { userId, targetUserId, text });
    setNewMessage("");
    setSending(false);
    inputRef.current?.focus();
  }, [newMessage, socket, sending, userId, targetUserId]);

  const statusText   = formatStatus(isTargetOnline, targetLastSeen);
  const grouped      = groupByDate(messages);

  return (
    <div
      className="flex flex-col"
      style={{ height: "100dvh", paddingTop: "60px", background: "var(--bg-base)" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-2 px-3 py-2.5 shrink-0"
        style={{
          background:     "var(--bg-surface)",
          borderBottom:   "1px solid var(--border)",
          backdropFilter: "blur(16px)",
          minHeight:      "56px",
        }}
      >
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="vm-btn vm-btn-ghost w-8 h-8 p-0 rounded-xl shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="w-9 h-9 rounded-full overflow-hidden"
            style={{ border: "2px solid var(--border-strong)" }}
          >
            <Image
              src={targetAvatar}
              alt={targetName}
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
            style={{
              background: isTargetOnline ? "var(--success)" : "var(--text-disabled)",
              border:     "2px solid var(--bg-surface)",
            }}
            aria-hidden
          />
        </div>

        {/* Name + status — takes remaining space */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <p
            className="text-sm font-semibold leading-tight truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {targetName}
          </p>
          <p
            className="text-xs leading-tight mt-0.5 truncate"
            style={{ color: isTargetOnline ? "var(--success)" : "var(--text-muted)" }}
            aria-live="polite"
          >
            {statusText}
          </p>
        </div>

        {/* Actions — only icons on mobile, label on sm+ */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            href="/chat"
            className="hidden sm:flex vm-btn vm-btn-ghost text-xs px-2.5 py-1.5 rounded-xl items-center gap-1.5"
            aria-label="Back to messages"
          >
            <MessageSquare size={13} strokeWidth={1.8} aria-hidden />
            <span>Messages</span>
          </Link>
          <button
            className="vm-btn vm-btn-ghost w-8 h-8 p-0 rounded-xl"
            aria-label="Voice call"
            title="Voice call"
          >
            <Phone size={14} strokeWidth={1.8} aria-hidden />
          </button>
          <button
            className="vm-btn vm-btn-ghost w-8 h-8 p-0 rounded-xl"
            aria-label="Video call"
            title="Video call"
          >
            <Video size={14} strokeWidth={1.8} aria-hidden />
          </button>
        </div>
      </header>

      {/* ── Messages ────────────────────────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto py-4"
        style={{ paddingLeft: "clamp(0.75rem, 3vw, 1.5rem)", paddingRight: "clamp(0.75rem, 3vw, 1.5rem)" }}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
            <div
              className="w-16 h-16 rounded-full overflow-hidden"
              style={{ border: "3px solid var(--border-strong)" }}
            >
              <Image src={targetAvatar} alt={targetName} width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{targetName}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                You are now connected. Say hello! 👋
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1 w-full" style={{ maxWidth: "min(100%, 640px)", margin: "0 auto" }}>
            {grouped.map(({ date, msgs }) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                  <span
                    className="text-xs px-3 py-1 rounded-full shrink-0"
                    style={{
                      background: "var(--bg-elevated)",
                      color:      "var(--text-muted)",
                      border:     "1px solid var(--border)",
                    }}
                  >
                    {dateLabel(date)}
                  </span>
                  <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                </div>

                {msgs.map((msg, i) => {
                  const isMe    = msg.senderId === userId;
                  const isLast  = i === msgs.length - 1 || msgs[i + 1]?.senderId !== msg.senderId;
                  const isFirst = i === 0 || msgs[i - 1]?.senderId !== msg.senderId;

                  return (
                    <div
                      key={i}
                      className={`flex items-end gap-2 ${
                        isMe ? "justify-end" : "justify-start"
                      } ${isFirst ? "mt-3" : "mt-0.5"}`}
                    >
                      {/* Other user avatar */}
                      {!isMe && (
                        <div className="w-6 h-6 shrink-0 self-end mb-0.5">
                          {isLast && (
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <Image src={targetAvatar} alt={targetName} width={24} height={24} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`flex flex-col ${ isMe ? "items-end" : "items-start" }`}
                        style={{ maxWidth: "min(72%, 320px)" }}
                      >
                        {!isMe && isFirst && (
                          <p className="text-xs mb-1 ml-1" style={{ color: "var(--text-muted)" }}>
                            {msg.firstName}
                          </p>
                        )}

                        <div
                          className="px-3.5 py-2 text-sm break-words leading-relaxed"
                          style={{
                            background:   isMe ? "var(--brand)" : "var(--bg-elevated)",
                            color:        isMe ? "#fff" : "var(--text-primary)",
                            borderRadius: isMe
                              ? isFirst && isLast ? "18px 18px 4px 18px"
                                : isFirst         ? "18px 18px 18px 18px"
                                : isLast          ? "18px 18px 4px 18px"
                                :                   "18px 18px 18px 18px"
                              : isFirst && isLast ? "18px 18px 18px 4px"
                                : isFirst         ? "4px 18px 18px 18px"
                                : isLast          ? "4px 18px 18px 4px"
                                :                   "4px 18px 18px 4px",
                            border:    isMe ? "none" : "1px solid var(--border)",
                            boxShadow: isMe ? "0 2px 8px rgba(99,102,241,0.2)" : "none",
                          }}
                        >
                          {msg.text}
                        </div>

                        {isLast && (
                          <p className="text-[10px] mt-1 px-1" style={{ color: "var(--text-disabled)" }}>
                            {dayjs(msg.createdAt).format("h:mm A")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} className="h-2" />
          </div>
        )}
      </div>

      {/* ── Input bar ───────────────────────────────────────────────────── */}
      <div
        className="shrink-0 px-3 py-2.5"
        style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center gap-2 rounded-2xl px-3 py-1.5"
          style={{
            maxWidth:   "min(100%, 640px)",
            margin:     "0 auto",
            background: "var(--bg-elevated)",
            border:     "1px solid var(--border-strong)",
          }}
        >
          <button
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            aria-label="Emoji"
            type="button"
          >
            <Smile size={16} strokeWidth={1.8} aria-hidden />
          </button>

          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-sm py-1.5"
            style={{ color: "var(--text-primary)", caretColor: "var(--brand)" }}
            placeholder="Type a message…"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            aria-label="Message input"
          />

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl"
            style={{
              background: newMessage.trim() ? "var(--brand)" : "transparent",
              color:      newMessage.trim() ? "#fff"         : "var(--text-disabled)",
              border:     "none",
              transition: "all 0.15s ease",
            }}
            aria-label="Send message"
            type="button"
          >
            <Send size={14} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
