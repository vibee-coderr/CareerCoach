import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        AI Career Coach
      </div>

      <div className="nav-links">

        <Link to="/">
          Resume Analysis
        </Link>

        <Link to="/interview">
          Interview
        </Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/summary">
          Summary
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;