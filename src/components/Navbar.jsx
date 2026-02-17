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
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Vagas
          </NavLink>

          <button
            type="button"
            className="nav-link"
            style={{ background: "transparent", border: 0, cursor: "pointer" }}
          >
            Avaliações da Empresa
          </button>

          <button
            type="button"
            className="nav-link"
            style={{ background: "transparent", border: 0, cursor: "pointer" }}
          >
            Cargos e Salários
          </button>
        </div>

        <div className="navbar-right">
          <button className="nav-icon-btn" aria-label="Buscar" type="button">
            🔍
          </button>
          <span className="nav-text">Buscar</span>
          <button className="nav-icon-btn" aria-label="Notificações" type="button">
            🔔
          </button>
          <button className="nav-icon-btn" aria-label="Perfil" type="button">
            👤
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
