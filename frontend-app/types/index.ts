// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  photoUrl?: string;
  age?: number;
  gender?: string;
  about?: string;
  skills?: string[];
  isPremium?: boolean;
  isAdmin?: boolean;
  isBanned?: boolean;
  lastSeen?: string | null;
}

// ─── Feed ────────────────────────────────────────────────────────────────────

export type FeedUser = Omit<User, "emailId" | "isAdmin" | "isBanned">;

export interface FeedResponse {
  users: FeedUser[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ─── Connection ──────────────────────────────────────────────────────────────

export type Connection = Omit<User, "emailId" | "isAdmin" | "isBanned">;

// ─── Connection Request ───────────────────────────────────────────────────────

export interface ConnectionRequest {
  _id: string;
  fromUserId: Connection;
  toUserId: string;
  status: "interested" | "ignored" | "accepted" | "rejected";
  createdAt?: string;
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  senderId: string;
  firstName: string;
  lastName: string;
  text: string;
  createdAt: string | Date;
}

// ─── Payment / Razorpay ───────────────────────────────────────────────────────

export type MembershipType = "silver" | "gold" | "diamond";

export interface RazorpayOrderResponse {
  amount: number;
  keyId: string;
  currency: string;
  orderId: string;
  notes: {
    firstName: string;
    lastName: string;
    emailId: string;
  };
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface AdminAnalytics {
  totalRevenue: number;
  dailyActiveUsers: number;
  totalMatches: number;
  revenueChart: { date: string; revenue: number; count: number }[];
  dauChart: { date: string; activeUsers: number }[];
}

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  photoUrl?: string;
  isPremium: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  lastSeen: string | null;
  createdAt: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Redux State ─────────────────────────────────────────────────────────────

export interface RootState {
  user: User | null;
  feed: FeedUser[] | null;
  connections: Connection[] | null;
  requests: ConnectionRequest[] | null;
}

// ─── API Response Wrappers ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// ─── Razorpay global (CDN) ───────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: { color: string };
  handler: () => void;
}
