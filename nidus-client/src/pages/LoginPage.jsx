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

  const navigate = useNavigate();
  const { setUser, setAccessToken } = useAuthStore();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    try {
      const response = await api.post("/auth/login", { email, password });
      setAccessToken(response.data.accessToken);
      setUser(response.data.safeUser);
      navigate("/app");
    } catch {
      setError("Invalid email or password.");
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

          <form onSubmit={handleFormSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
              />
            </div>
            <button type="submit" className="btn-primary auth-submit">
              Log in
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
