# ⚡ VibeMatch

A full-stack developer networking platform — swipe through profiles, send connection requests, chat in real-time, and manage your community with a built-in admin dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, DaisyUI v5, Framer Motion, Redux Toolkit, Socket.IO Client, Recharts |
| Backend | Node.js, Express 5, MongoDB (Mongoose 8), Socket.IO v4 |
| Auth | JWT (httpOnly cookies), GitHub OAuth, Google OAuth |
| Payments | Razorpay (orders + webhooks) |
| Media | Cloudinary (auto-optimized uploads, drag & drop) |
| Real-time | Socket.IO WebSocket (chat + online presence + heartbeat) |
| Docs | Swagger / OpenAPI 3.0 (dev only) |
| Logging | Winston + Morgan |
| Validation | Joi (backend), TypeScript (frontend) |

---

## Project Structure

```
VibeMatch/
├── backend-app/          # Express API server
│   └── src/
│       ├── config/       # DB, JWT, Cloudinary, Razorpay, logger
│       ├── controllers/  # auth, user, request, payment, chat, admin, upload
│       ├── middlewares/  # userAuth, adminAuth, validate, error
│       ├── models/       # User, ConnectionRequest, Chat, Payment
│       ├── routes/v1/    # All API routes with Swagger JSDoc
│       ├── services/     # Business logic layer
│       ├── utils/        # socket.js, ApiError, catchAsync, constants
│       └── validations/  # Joi schemas
└── frontend-app/         # Next.js 15 App Router
    ├── app/
    │   ├── page.tsx          # Landing page (public)
    │   ├── feed/             # Infinite-scroll swipe feed
    │   ├── login/            # Login (email + GitHub + Google)
    │   ├── signup/           # Signup
    │   ├── profile/          # Edit profile + image upload
    │   ├── connections/      # Connections with last-seen
    │   ├── requests/         # Incoming connection requests
    │   ├── chat/[id]/        # Real-time 1:1 chat
    │   ├── premium/          # Razorpay subscription plans
    │   └── admin/            # Admin dashboard (isAdmin only)
    ├── api/                  # Axios API layer (typed)
    ├── components/           # NavBar, Footer, EditProfile, HeartbeatProvider
    ├── redux/                # Store + 4 slices (user, feed, connections, requests)
    ├── types/                # Shared TypeScript interfaces
    └── utils/                # socket.ts, constants.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)
- Razorpay account (test mode is fine)
- Cloudinary account (free tier works)
- Optional: Google / GitHub OAuth apps

### Backend setup

```bash
cd backend-app
cp .env.example .env   # fill in your values
npm install
npm run dev            # starts on http://localhost:7777
```

**Required `.env` keys:**

```env
PORT=7777
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/vibeMatch
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend setup

```bash
cd frontend-app
cp .env.local.example .env.local   # fill in your values
npm install
npm run dev     # starts on http://localhost:3000
```

**Required `.env.local` keys:**

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:7777
```

---

## Available Scripts

### Frontend (`frontend-app/`)

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (Next.js rules) |
| `npm run compile-ts` | TypeScript type-check without emit |

### Backend (`backend-app/`)

| Script | Description |
|---|---|
| `npm run dev` | Start with nodemon |
| `npm run start` | Production start |
| `npm run lint` | ESLint (Airbnb-base rules) |
| `npm run prettier` | Prettier format check |
| `npm run prettier:fix` | Auto-fix formatting |

---

## API Reference

Swagger UI is available at **`http://localhost:7777/api/docs`** (development mode only).

Tags are sorted alphabetically: **Admin → Auth → Chat → Payments → Profile → Requests → Upload → Users**

### Key endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/signup` | — | Register new user |
| `POST` | `/api/login` | — | Email + password login |
| `POST` | `/api/logout` | — | Clear session cookie |
| `GET` | `/api/profile/view` | ✅ | Get own profile |
| `PUT` | `/api/profile/edit` | ✅ | Update profile |
| `POST` | `/api/heartbeat` | ✅ | Update lastSeen timestamp |
| `GET` | `/api/feed?cursor=&limit=` | ✅ | Cursor-paginated feed |
| `GET` | `/api/user/connections` | ✅ | Accepted connections (with lastSeen) |
| `GET` | `/api/user/requests/received` | ✅ | Pending incoming requests |
| `POST` | `/api/request/send/:status/:userId` | ✅ | Send connection request |
| `POST` | `/api/request/review/:status/:requestId` | ✅ | Accept / reject request |
| `POST` | `/api/payment/create` | ✅ | Create Razorpay order |
| `POST` | `/api/payment/webhook` | — | Razorpay payment webhook |
| `GET` | `/api/premium/verify` | ✅ | Check premium status |
| `POST` | `/api/upload/photo` | ✅ | Upload photo to Cloudinary |
| `GET` | `/api/chat/:targetUserId` | ✅ | Get chat history |
| `GET` | `/api/admin/analytics` | Admin | Revenue, DAU, matches + charts |
| `GET` | `/api/admin/users` | Admin | Paginated user list |
| `PATCH` | `/api/admin/users/:id/ban` | Admin | Ban / unban user |
| `GET` | `/api/admin/reported` | Admin | Banned profiles |

---

## Real-time Events (Socket.IO)

| Event (emit) | Payload | Description |
|---|---|---|
| `joinChat` | `{ userId, targetUserId }` | Join a chat room; verifies accepted connection |
| `sendMessage` | `{ userId, targetUserId, text }` | Send a message; persisted to MongoDB |
| `heartbeat` | `{ userId }` | Keep lastSeen alive from chat page |

| Event (listen) | Payload | Description |
|---|---|---|
| `messageReceived` | `{ senderId, firstName, lastName, text, createdAt }` | New incoming message |
| `userStatus` | `{ userId, isOnline, lastSeen? }` | Online/offline status change |

---

## New Features (v2)

### Optimized Image Uploads
- Drag-and-drop or click-to-upload in profile editor
- Backend proxies to Cloudinary with auto `800×800` crop, `quality: auto`, `fetch_format: auto`
- Max 5 MB, allows JPG / PNG / WebP
- Endpoint: `POST /api/upload/photo`

### Admin Dashboard
- Protected by `isAdmin` flag on the User model (`/admin` in frontend, `/api/admin/*` in backend)
- **Overview tab:** total revenue (₹), daily active users, total matches, 30-day revenue area chart, 30-day DAU bar chart (Recharts)
- **Users tab:** searchable, paginated table with ban / unban controls

### Infinite Scroll Feed
- Cursor-based pagination (`?cursor=<ObjectId>&limit=10`) — no skip cost, no duplicates
- `IntersectionObserver` sentinel triggers next page load automatically
- Side queue panel shows upcoming profiles
- Banned users are excluded from the feed

### Last Seen / Heartbeat
- `lastSeen: Date` field on User model
- HTTP heartbeat via `POST /api/heartbeat` (called every 30 s by `HeartbeatProvider`)
- Socket heartbeat event from chat page
- `userStatus` socket events carry `lastSeen` ISO string
- Displayed as "Online", "Active 5m ago", etc. on connections list, feed cards, and chat header

---

## OAuth (GitHub & Google)

The login and signup pages show **Continue with GitHub** and **Continue with Google** buttons.  
They redirect to `GET /api/auth/github` and `GET /api/auth/google` on the backend.  

Backend OAuth setup with `passport.js` is left as a guided extension — see the [passport-github2](https://www.npmjs.com/package/passport-github2) and [passport-google-oauth20](https://www.npmjs.com/package/passport-google-oauth20) packages.

---

## Making a User Admin

There is no UI for this — set the flag directly in MongoDB:

```js
db.users.updateOne(
  { emailId: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

---

## License

ISC © [Achal Kumar](https://github.com/achalkumar98)
