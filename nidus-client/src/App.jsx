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

export default function App() {
  const { setAccessToken, setUser } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshResponse = await api.post("/auth/refresh");
        const token = refreshResponse.data.accessToken;
        setAccessToken(token);

        const userResponse = await api.get("/users/me");
        setUser(userResponse.data);
      } catch {
        console.warn("Session not found or expired");
        setUser(null);
        setAccessToken(null);
      }
    };

    initAuth();
  }, [setAccessToken, setUser]);

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
