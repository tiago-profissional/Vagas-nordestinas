import { NavLink, Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            Vagas Nordestinas
          </Link>
        </div>

        <div className="navbar-center">
          <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Vagas
          </NavLink>
          <Link to="/ai-resume" className="nav-link">
            AI Resume
          </Link>
        </div>

        <div className="navbar-right">
          <Link to="/jobs" className="nav-icon-btn" aria-label="Buscar vagas">
            🔍
          </Link>
          <Link to="/profile" className="nav-icon-btn" aria-label="Perfil">
            👤
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
