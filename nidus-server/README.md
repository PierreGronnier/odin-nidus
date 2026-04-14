# Nidus Server

The backend of Nidus, built with **Node.js**, **Express 5**, and **Prisma ORM** backed by a **PostgreSQL** database.

---

## Stack

| Tool | Purpose |
|---|---|
| Express 5 | HTTP server & routing |
| Prisma | ORM + database migrations |
| PostgreSQL | Relational database |
| JWT | Access & refresh token authentication |
| Passport.js | Google OAuth 2.0 strategy |
| bcrypt | Password hashing |
| Zod | Request body validation |
| Helmet | HTTP security headers |
| Morgan | HTTP request logging |

---

## Project Structure

```
src/
├── app.js                  # Express app setup (middleware, routes)
├── server.js               # Entry point — starts the HTTP server
├── config/
│   ├── passport.js         # Google OAuth strategy
│   └── prisma.js           # Shared Prisma client instance
├── routes/                 # Route definitions
├── controllers/            # Request handlers (thin layer, calls services)
├── services/               # Business logic
├── middlewares/
│   ├── auth.middleware.js  # JWT verification
│   └── errorHandler.js     # Global error handler
└── validators/             # Zod schemas for request validation
```

---

## API Overview

### Auth — `/api/auth`

| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create account |
| POST | `/login` | Login with email & password |
| POST | `/logout` | Logout (clears refresh cookie) |
| POST | `/refresh` | Issue a new access token from the refresh cookie |
| GET | `/google` | Redirect to Google OAuth |
| GET | `/google/callback` | Google OAuth callback |

### Users — `/api/users`

| Method | Path | Description |
|---|---|---|
| GET | `/me` | Get current user profile |
| PUT | `/me` | Update username, bio, avatar |
| GET | `/search?username=` | Search users by username |
| GET | `/:id` | Get a user by ID |

### Friendships — `/api/friendships`

| Method | Path | Description |
|---|---|---|
| GET | `/` | Get accepted friends list |
| GET | `/pending` | Get received friend requests |
| GET | `/sent` | Get sent friend requests |
| POST | `/` | Send a friend request |
| PUT | `/:id/accept` | Accept a request |
| PUT | `/:id/decline` | Decline a request |
| DELETE | `/:id` | Remove a friend |
| DELETE | `/:id/cancel` | Cancel a sent request |

### Conversations — `/api/conversations`

| Method | Path | Description |
|---|---|---|
| GET | `/` | Get all conversations for the current user |
| POST | `/` | Create a DM or group conversation |
| GET | `/:id` | Get conversation details + members |
| PUT | `/:id` | Update group name / avatar (owner only) |
| DELETE | `/:id` | Delete a group (owner only) |
| PUT | `/:id/participants` | Add participants (owner only) |
| DELETE | `/:id/participants` | Remove participants / leave group |

### Messages — `/api/conversations/:conversationId/messages`

| Method | Path | Description |
|---|---|---|
| GET | `/` | Fetch all messages in a conversation |
| POST | `/` | Send a message |
| PUT | `/:messageId` | Edit a message (sender only) |
| DELETE | `/:messageId` | Delete a message (sender only) |

---

## Database Schema

The database has five models:

- **User** — accounts (email/password or Google OAuth)
- **Conversation** — DM or group chat, with an optional `ownerId` for groups
- **ConversationParticipant** — join table linking users to conversations
- **Message** — belongs to a conversation and a sender
- **Friendship** — between two users, with status `PENDING | ACCEPTED | DECLINED | BLOCKED`

Cascade deletes are configured so that removing a conversation also removes its participants and messages.

---

## Authentication

- **Access token** — JWT signed with `JWT_SECRET`, expires in 15 minutes. Sent as a `Bearer` header.
- **Refresh token** — JWT signed with `JWT_REFRESH_SECRET`, expires in 7 days. Stored in an `httpOnly` cookie.
- The `authMiddleware` verifies the access token on every protected route and attaches the decoded payload to `req.user`.

---

## Environment Variables

Create a `.env` file at the root of `nidus-server/`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/nidus
PORT=3000
CLIENT_URL=http://localhost:5173

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

---

## Available Scripts

```bash
npm run dev     # Start server with --watch (auto-restart on file changes)
npm start       # Start server in production mode
```

### Database

```bash
npx prisma migrate dev      # Apply migrations in development
npx prisma migrate deploy   # Apply migrations in production
npx prisma studio           # Open Prisma visual database browser
```

---

## Error Handling

All route handlers call `next(error)` on failure. The global `errorHandler` middleware at the end of the Express chain reads `error.status` (set manually in services) and responds with a consistent JSON shape:

```json
{ "message": "Descriptive error message" }
```
