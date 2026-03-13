import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Sun, Moon } from "lucide-react";
import logo from "../assets/nidus-logo.svg";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user } = useAuthStore();
  const [isLight, setIsLight] = useState(false);

  const toggleTheme = () => {
    document.body.classList.toggle("light");
    setIsLight(!isLight);
  };

  return (
    <nav className="navbar">
      <div className="nav-logo-wrapper">
        <img src={logo} alt="Nidus" className="nav-logo" />
        <span>Nidus</span>
      </div>
      <div className="nav-actions">
        <button onClick={toggleTheme}>
          {isLight ? (
            <Moon size={22} color="var(--accent)" />
          ) : (
            <Sun size={22} color="var(--accent)" />
          )}
        </button>
        {user ? (
          <div>{/* avatar + logout */}</div>
        ) : (
          <div>
            <Link to="/login" className="btn-ghost">
              Log in
            </Link>
            <Link to="/register" className="btn-primary">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
