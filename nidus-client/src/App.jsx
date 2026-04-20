import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppPage from "./pages/AppPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { useEffect } from "react";
import api from "./services/axios";
import useAuthStore from "./store/authStore";

const MAX_ATTEMPTS = 10;
const BASE_DELAY_MS = 3000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function App() {
  const { setAccessToken, setUser, setIsLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          const refreshResponse = await api.post("/auth/refresh");
          const token = refreshResponse.data.accessToken;
          setAccessToken(token);

          const userResponse = await api.get("/users/me");
          setUser(userResponse.data);

          setIsLoading(false);
          return;
        } catch (err) {
          const status = err?.response?.status;

          if (status === 401) {
            setUser(null);
            setAccessToken(null);
            setIsLoading(false);
            return;
          }

          if (attempt < MAX_ATTEMPTS) {
            await sleep(BASE_DELAY_MS);
          } else {
            console.warn("Server did not respond after max attempts");
            setUser(null);
            setAccessToken(null);
            setIsLoading(false);
          }
        }
      }
    };

    initAuth();
  }, [setAccessToken, setUser, setIsLoading]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
      </Route>
      <Route path="/auth/callback" element={<GoogleCallbackPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
