function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <h1 className="navbar-logo">Vagas Nordestinas</h1>
        </div>

        <div className="navbar-center">
          <a href="#" className="nav-link active">
            Vagas
          </a>
          <a href="#" className="nav-link">
            Avaliações da Empresa
          </a>
          <a href="#" className="nav-link">
            Cargos e Salários
          </a>
        </div>

        <div className="navbar-right">
          <button className="nav-icon-btn" aria-label="Buscar" type="button">
            🔍
          </button>
          <span className="nav-text">Buscar</span>
          <button
            className="nav-icon-btn"
            aria-label="Notificações"
            type="button"
          >
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
