import { useState } from "react";
import { Link } from "react-router-dom";

import brandLogo from "../img/Logo6.1.svg";
import menuIcon from "../img/menu_hamburger.svg";

import "../styles/Header.css";

export default function Headers() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((current) => !current);
  }

  return (
    <header className="vne-header">
      <div className="vne-header__container">
        <Link
          to="/"
          className="vne-header__logo"
          onClick={closeMenu}
          aria-label="Vagas Nordestinas — página inicial"
        >
          <img
            src={brandLogo}
            alt="Vagas Nordestinas"
            className="vne-header__logo-image"
          />
        </Link>

        <nav
          id="menu-principal"
          className={`vne-header__nav ${
            menuOpen ? "is-open" : ""
          }`}
          aria-label="Navegação principal"
        >
          <Link
            className="vne-header__nav-link"
            to="/"
            onClick={closeMenu}
          >
            Vagas
          </Link>

          <Link
            className="vne-header__nav-link"
            to="/reviews"
            onClick={closeMenu}
          >
            Avaliações da Empresa
          </Link>

          <Link
            className="vne-header__nav-link"
            to="/salaries"
            onClick={closeMenu}
          >
            Cargos e Salários
          </Link>

          <div className="vne-header__mobile-icons">
            <button
              type="button"
              className="vne-header__mobile-search"
              onClick={closeMenu}
            >
              <span aria-hidden="true">🔎</span>
              Buscar
            </button>

            <Link
              to="/login"
              className="vne-header__mobile-login"
              onClick={closeMenu}
            >
              Entrar
            </Link>

            <Link
              to="/signup"
              className="vne-header__mobile-signup"
              onClick={closeMenu}
            >
              Criar conta
            </Link>
          </div>
        </nav>

        <div className="vne-header__actions">
          <button
            type="button"
            className="vne-header__icon-btn"
            aria-label="Buscar vagas"
          >
            <span aria-hidden="true">🔎</span>
          </button>

          <Link
            to="/login"
            className="vne-header__login-btn"
          >
            Entrar
          </Link>

          <Link
            to="/signup"
            className="vne-header__signup-btn"
          >
            Criar conta
          </Link>
        </div>

        <button
          type="button"
          className={`vne-header__hamburger ${
            menuOpen ? "is-active" : ""
          }`}
          onClick={toggleMenu}
          aria-label={
            menuOpen ? "Fechar menu" : "Abrir menu"
          }
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
        >
          <img src={menuIcon} alt="" />
        </button>
      </div>
    </header>
  );
}