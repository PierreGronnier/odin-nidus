import useAuthStore from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
}
