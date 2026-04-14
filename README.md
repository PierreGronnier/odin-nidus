# Nidus — Private Messaging App

Nidus is a full-stack private messaging application built with **React** (frontend) and **Node.js / Express** (backend). It allows users to register, add friends, and exchange messages in private or group conversations.

---

## Project Structure

```
pierregronnier-odin-nidus/
├── nidus-client/       # React frontend (Vite)
└── nidus-server/       # Node.js / Express backend
```

---

## Features

- **Authentication** — Register / Login with email & password, or via Google OAuth. Sessions are managed with JWT access tokens and HTTP-only refresh token cookies.
- **Friend system** — Search for users, send/accept/decline/cancel friend requests.
- **Private messaging** — Start a 1-on-1 conversation with any friend.
- **Group chats** — Create groups, manage members, and transfer ownership automatically when the owner leaves.
- **Profile customization** — Update username, bio, and avatar (uploaded to Cloudinary).
- **Responsive UI** — Fully usable on desktop and mobile, with a bottom navigation bar and slide-in sidebar on small screens.
- **Light / Dark mode** — Theme toggle available in both the landing navbar and the app sidebar.

---

## Tech Stack

| Layer        | Technology                                         |
| ------------ | -------------------------------------------------- |
| Frontend     | React 19, Vite, Zustand, React Router, Axios       |
| Backend      | Node.js, Express 5, Prisma ORM, PostgreSQL         |
| Auth         | JWT (access + refresh), Passport.js (Google OAuth) |
| File uploads | Cloudinary                                         |
| Validation   | Zod                                                |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database
- A Cloudinary account (for avatar uploads)
- A Google OAuth application (optional, for Google login)

### 1. Clone the repository

```bash
git clone https://github.com/PierreGronnier/pierregronnier-odin-nidus.git
cd pierregronnier-odin-nidus
```

### 2. Set up the server

```bash
cd nidus-server
npm install
```

Create a `.env` file (see `nidus-server/README.md` for required variables), then run migrations:

```bash
npx prisma migrate deploy
```

Start the server:

```bash
npm run dev
```

### 3. Set up the client

```bash
cd nidus-client
npm install
```

Create a `.env` file (see `nidus-client/README.md` for required variables), then start the dev server:

```bash
npm run dev
```

---

## How It Works

```
Browser (React)
    │
    │  REST API calls (Axios + JWT Bearer token)
    ▼
Express Server
    │
    │  Prisma ORM
    ▼
PostgreSQL Database
```

The client stores a short-lived **access token** in memory (Zustand) and a long-lived **refresh token** in an HTTP-only cookie. When a request returns `401`, Axios automatically attempts to refresh the access token before retrying.

> **Note:** The app uses polling (every 3 seconds) to fetch new messages, as WebSocket / real-time communication is out of scope for this project.
