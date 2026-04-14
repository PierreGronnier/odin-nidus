# Nidus Client

The frontend of Nidus, built with **React 19** and **Vite**. It communicates with the Nidus server via a REST API and manages all UI state with **Zustand** stores.

---

## Stack

| Tool | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router v7 | Client-side routing |
| Zustand | Global state management |
| Axios | HTTP client with interceptors |
| Lucide React | Icons |
| Cloudinary | Avatar image uploads |

---

## Project Structure

```
src/
├── pages/              # Top-level route components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── AppPage.jsx
│   └── GoogleCallbackPage.jsx
├── components/
│   ├── sidebar/        # Sidebar + navigation items
│   ├── panels/         # Main content panels (chat, friends, groups…)
│   ├── modals/         # Overlays (edit profile, create/edit group, confirm)
│   └── ui/             # Generic UI (toasts, constellation background)
├── store/              # Zustand stores (auth, messages, friends…)
├── services/           # Axios instance, Cloudinary upload helper
└── styles/             # Per-component CSS files + global variables
```

---

## Routing

| Path | Component | Access |
|---|---|---|
| `/` | `LandingPage` | Public only |
| `/login` | `LoginPage` | Public only |
| `/register` | `RegisterPage` | Public only |
| `/auth/callback` | `GoogleCallbackPage` | Public |
| `/app` | `AppPage` | Protected |

`PublicRoute` redirects authenticated users to `/app`. `ProtectedRoute` redirects unauthenticated users to `/login`.

---

## State Management

Each domain has its own Zustand store:

| Store | Responsibility |
|---|---|
| `authStore` | Current user & access token |
| `friendStore` | Friends list |
| `requestStore` | Sent & received friend requests |
| `conversationStore` | Groups, current conversation, members |
| `messageStore` | Messages keyed by conversation ID |
| `toastStore` | Toast notification queue |

---

## Authentication Flow

1. On app load, `App.jsx` calls `POST /auth/refresh` to silently restore the session from the HTTP-only cookie.
2. The returned access token is stored in `authStore` (in memory only — never in `localStorage`).
3. Every Axios request attaches the token as a `Bearer` header.
4. On a `401` response, the Axios interceptor automatically retries the refresh. If it fails, the user is logged out and redirected to `/login`.

---

## Environment Variables

Create a `.env` file at the root of `nidus-client/`:

```env
VITE_API_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## Notes

- **No `localStorage`** — tokens are kept in memory to reduce XSS exposure.
- **Polling** — `ChatPanel` fetches new messages every 3 seconds via `setInterval`. This is intentional given the absence of WebSockets.
- **Image uploads** — Avatars (user & group) are uploaded directly from the browser to Cloudinary using an unsigned upload preset. The returned URL is then saved via the API.
