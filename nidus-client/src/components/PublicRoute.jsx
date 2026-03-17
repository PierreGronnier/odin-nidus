import useAuthStore from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return children;
  }

  return <Navigate to="/app" />;
}
