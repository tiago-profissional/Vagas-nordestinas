import "../styles/Footer.css";

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
          <a href="/">Vagas</a>
          <a href="/about">Sobre nós</a>
          <a href="/support">Suporte</a>
        </nav>

        <nav className="footer-links" aria-label="Informações legais">
          <h3>Legal</h3>
          <a href="/">Termos de Uso</a>
          <a href="/">Política de Privacidade</a>
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