import { useState } from "react";
import { Link } from "react-router-dom";
import menuIcon from "../img/menu_hamburger.svg"; // ✅ your image
import "../styles/Header.css";

export default function Headers() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="vne-header">
      <div className="vne-header__container">

        <div className="vne-header__logo">
          Vagas Nordestinas
        </div>

        <nav className={`vne-header__nav ${menuOpen ? "is-open" : ""}`}>
          <Link
            className="vne-header__nav-link"
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Vagas
          </Link>

          <Link
            className="vne-header__nav-link"
            to="/reviews"
            onClick={() => setMenuOpen(false)}
          >
            Avaliações da Empresa
          </Link>

          <Link
            className="vne-header__nav-link"
            to="/salaries"
            onClick={() => setMenuOpen(false)}
          >
            Cargos e Salários
          </Link>

          <div className="vne-header__mobile-icons">
            <button>Buscar</button>
            <button>Notificações</button>
            <button>Perfil</button>
          </div>
        </nav>

        <div className="vne-header__actions">
          <button className="vne-header__icon-btn">🔎</button>
          <button className="vne-header__icon-btn">🔔</button>
          <button className="vne-header__icon-btn">👤</button>
        </div>

        {/* ✅ NEW IMAGE HAMBURGER */}
        <button
          className="vne-header__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          aria-label="Menu"
        >
          <img src={menuIcon} alt="menu" />
        </button>

      </div>
    </header>
  );
}