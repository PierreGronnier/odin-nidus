import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppPage from "./pages/AppPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { useEffect } from "react";
import api from "./services/axios";
import useAuthStore from "./store/authStore";

export default function App() {
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await api.post("/auth/refresh");
        setAccessToken(response.data.accessToken);
      } catch {
        // pas connecté
      }
    };
    refresh();
  }, []);

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
    </Routes>
  );
}
