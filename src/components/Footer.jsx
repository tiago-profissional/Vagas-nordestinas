import "../styles/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>
            Vagas <span>Nordestinas</span>
          </h2>

          <p>Conectando talentos do Nordeste a novas oportunidades.</p>
        </div>

        <nav className="footer-links" aria-label="Vagas Nordestinas">
          <h3>Vagas Nordestinas</h3>
          <Link to="/jobs">Vagas</Link>
          <Link to="/about">Sobre nós</Link>
          <Link to="/relatar-problema">Relatar problema</Link>
        </nav>

        <nav className="footer-links" aria-label="Informações legais">
          <h3>Legal</h3>
          <Link to="/termos-de-uso">Termos de Uso</Link>
          <Link to="/politica-de-privacidade">Política de Privacidade</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Vagas Nordestinas. Todos os direitos
          reservados.
        </p>

        <p>
          Desenvolvido por <strong>Tiago Ramon</strong>
        </p>
      </div>
    </footer>
  );
}

export default Footer;