import useAuthStore from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { accessToken, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
}
