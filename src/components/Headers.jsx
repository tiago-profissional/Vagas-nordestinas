import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import brandLogo from "../img/logo-vagas-nordestinas.png";
import menuIcon from "../img/menu_hamburger.svg";

import { useCurrentUser } from "../hooks/useCurrentUser.js";
import { resolveAvatarUrl } from "../services/avatarUrl.js";

import "../styles/Header.css";

function getInitials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function UserAvatar({ name, avatarUrl }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const resolvedAvatarUrl = resolveAvatarUrl(avatarUrl);
  const showImage = resolvedAvatarUrl && failedUrl !== resolvedAvatarUrl;

  return (
    <span className="vne-header__avatar" aria-hidden="true">
      {showImage ? (
        <img
          key={resolvedAvatarUrl}
          src={resolvedAvatarUrl}
          alt=""
          onError={() => setFailedUrl(resolvedAvatarUrl)}
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}

export default function Headers() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const user = useCurrentUser();
  const displayName = user?.name || "Minha conta";
  const firstName = displayName.split(" ")[0];

  function closeMenu() {
    setMenuOpen(false);
    setAccountOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((current) => !current);
  }

  function openJobs() {
    closeMenu();
    navigate("/jobs");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeMenu();
    window.dispatchEvent(new Event("auth:changed"));
    navigate("/login");
  }

  function getNavLinkClass({ isActive }) {
    return `vne-header__nav-link ${isActive ? "active" : ""}`;
  }

  useEffect(() => {
    if (!accountOpen) return undefined;

    function handleClick(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    }

    function handleKey(event) {
      if (event.key === "Escape") setAccountOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [accountOpen]);

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
          className={`vne-header__nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Navegação principal"
        >
          <NavLink
            to="/jobs"
            end
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            Vagas
          </NavLink>
          {/* PAINEL DE VAGAS: Recrutador e Admin */}
          {user && (user.role === "recruiter" || user.role === "admin") && (
            <NavLink
              to="/dashboard"
              className={getNavLinkClass}
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>
          )}

          {/* PAINEL ADMIN: Apenas Administradores */}
          {user && user.role === "admin" && (
            <NavLink
              to="/admin/users"
              className={getNavLinkClass}
              onClick={closeMenu}
            >
              Gerenciar Usuários
            </NavLink>
          )}

          <NavLink
            to="/ai-resume"
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            Currículo com IA
          </NavLink>
          {user?.role === "admin" ? (
            <NavLink
              to="/tickets"
              className={getNavLinkClass}
              onClick={closeMenu}
            >
              Suporte (Admin)
            </NavLink>
          ) : (
            <NavLink
              to="/relatar-problema"
              className={getNavLinkClass}
              onClick={closeMenu}
            >
              Relatar problema
            </NavLink>
          )}

          <div className="vne-header__mobile-icons">
            <button
              type="button"
              className="vne-header__mobile-search"
              onClick={openJobs}
            >
              <span aria-hidden="true">⌕</span>
              Buscar
            </button>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="vne-header__mobile-user"
                  onClick={closeMenu}
                >
                  <UserAvatar name={displayName} avatarUrl={user.avatar_url} />
                  <span>{displayName}</span>
                </Link>

                <button type="button" onClick={handleLogout}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="profile-icon"
                  onClick={closeMenu}
                  aria-label="Entrar para acessar o perfil"
                >
                  👤
                </Link>

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
              </>
            )}
          </div>
        </nav>

        <div className="vne-header__actions">
          <button
            type="button"
            className="vne-header__icon-btn"
            aria-label="Buscar vagas"
            onClick={openJobs}
          >
            <span aria-hidden="true">⌕</span>
          </button>

          {user ? (
            <div className="vne-header__account" ref={accountRef}>
              <button
                type="button"
                className="vne-header__account-btn"
                onClick={() => setAccountOpen((current) => !current)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                aria-label={`Menu da conta de ${displayName}`}
              >
                <UserAvatar name={displayName} avatarUrl={user.avatar_url} />
                <span className="vne-header__account-name">{firstName}</span>
              </button>

              {accountOpen && (
                <div className="vne-header__account-menu" role="menu">
                  <div className="vne-header__account-info">
                    <strong>{displayName}</strong>
                    {user.email && <span>{user.email}</span>}
                  </div>

                  <Link
                    to="/profile"
                    className="vne-header__account-item"
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    Meu perfil
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      to="/admin/users"
                      className="vne-header__account-item"
                      role="menuitem"
                      onClick={closeMenu}
                    >
                      Gerenciar Usuários
                    </Link>
                  )}

                  <button
                    type="button"
                    className="vne-header__account-item"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="profile-icon"
                onClick={closeMenu}
                aria-label="Entrar para acessar o perfil"
              >
                👤
              </Link>

              <Link to="/login" className="vne-header__login-btn">
                Entrar
              </Link>

              <Link to="/signup" className="vne-header__signup-btn">
                Criar conta
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={`vne-header__hamburger ${
            menuOpen ? "is-active" : ""
          }`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
        >
          <img src={menuIcon} alt="" />
        </button>
      </div>
    </header>
  );
}