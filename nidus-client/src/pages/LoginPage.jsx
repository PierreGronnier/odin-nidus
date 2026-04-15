import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../services/axios.js";
import useAuthStore from "../store/authStore.js";
import "../styles/FormPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slowWarning, setSlowWarning] = useState(false);

  const navigate = useNavigate();
  const { setUser, setAccessToken } = useAuthStore();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSlowWarning(false);
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      setSlowWarning(true);
    }, 5000);

    try {
      const response = await api.post("/auth/login", { email, password });
      clearTimeout(timeoutId);
      setAccessToken(response.data.accessToken);
      setUser(response.data.safeUser);
      navigate("/app");
    } catch (err) {
      clearTimeout(timeoutId);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-left">
        <div className="auth-left-content">
          <p className="auth-left-eyebrow">Private messaging</p>
          <h2 className="auth-left-title">
            For the people
            <br />
            <em>closest to us.</em>
          </h2>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Log in to your Nidus account</p>
          </div>

          {error && <p className="auth-error">{error}</p>}
          {slowWarning && (
            <p className="auth-error" style={{ background: "var(--accent)" }}>
              The server is waking up. This may take up to 45 seconds. Please
              wait...
            </p>
          )}

          <form onSubmit={handleFormSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <a
            href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
            className="btn-ghost auth-google"
          >
            Continue with Google
          </a>
        </div>
      </div>
    </div>
  );
}
