import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import "../styles/NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <AlertCircle size={64} strokeWidth={1.5} />
        <h1>404</h1>
        <p>Oops! This page seems to be unavailable.</p>
        <Link to="/" className="btn-primary not-found-link">
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
