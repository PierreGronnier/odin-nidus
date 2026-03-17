import { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import logo from "../assets/nidus-logo.svg";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isLight, setIsLight] = useState(false);

  const toggleTheme = () => {
    document.body.classList.toggle("light");
    setIsLight(!isLight);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo-wrapper">
        <img src={logo} alt="Nidus" className="nav-logo" />
        <span>Nidus</span>
      </Link>
      <div className="nav-actions">
        <button onClick={toggleTheme}>
          {isLight ? (
            <Moon size={22} color="var(--accent)" />
          ) : (
            <Sun size={22} color="var(--accent)" />
          )}
        </button>
        <div className="nav-links">
          <Link to="/login" className="btn-ghost">
            Log in
          </Link>
          <Link to="/register" className="btn-primary">
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
