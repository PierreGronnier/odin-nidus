import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="landing-footer">
      <span>© 2026 Nidus</span>
      <a
        href="https://github.com/PierreGronnier"
        target="_blank"
        rel="noreferrer"
      >
        Made by Pierre Gronnier <Github size={16} />
      </a>
    </footer>
  );
}
