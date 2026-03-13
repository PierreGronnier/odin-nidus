import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="landing">
      <Navbar />
      <main className="landing-hero">
        <p className="landing-eyebrow">Private messaging</p>
        <h1 className="landing-title">
          For the people
          <br />
          <em>closest to us.</em>
        </h1>
        <p className="landing-subtitle">
          Nidus is a private space for the conversations you share with the
          people you keep close.
        </p>
        <div className="landing-cta">
          <Link to="/register" className="btn-primary btn-large">
            Get started
          </Link>
          <Link to="/login" className="btn-ghost btn-large">
            I already have an account
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
