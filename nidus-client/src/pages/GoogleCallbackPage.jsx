import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../store/authStore.js";

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const { setAccessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setAccessToken(token);
      navigate("/app");
    } else {
      navigate("/");
    }
  }, []);

  return <div>Google Callback</div>;
}
