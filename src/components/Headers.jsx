import "../styles/Header.css";

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-container">
        
        <div className="logo">
          Vagas Nordestinas
        </div>

        <nav className="nav-links">
          <a href="/">Vagas</a>
          <a href="#">Avaliações da Empresa</a>
          <a href="#">Cargos e Salários</a>
        </nav>

        <div className="header-icons">
          <span className="icon">🔍</span>
          <span className="icon">🔔</span>
          <span className="icon">👤</span>
        </div>

      </div>
    </header>
  );
}