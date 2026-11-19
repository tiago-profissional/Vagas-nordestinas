import { Link } from "react-router-dom";

import Footer from "./Footer.jsx";
import Headers from "./Headers.jsx";

import "../styles/AiResume.css";

export default function AiResume() {
  return (
    <div className="vn-ai-resume page-wrapper">
      <Headers />
      <main className="vn-ai-resume__main">
        <section className="vn-ai-resume__content">
          <p className="vn-ai-resume__eyebrow">Vagas Nordestinas</p>
          <h1>Currículo com IA</h1>
          <p className="vn-ai-resume__description">
            A experiência de currículo com IA está sendo integrada ao portal.
            Enquanto isso, complete seu perfil e explore oportunidades na
            plataforma.
          </p>
          <div className="vn-ai-resume__actions">
            <Link
              to="/profile"
              className="vn-ai-resume__button vn-ai-resume__button--primary"
            >
              Completar meu perfil
            </Link>
            <Link
              to="/"
              className="vn-ai-resume__button vn-ai-resume__button--secondary"
            >
              Explorar vagas
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
