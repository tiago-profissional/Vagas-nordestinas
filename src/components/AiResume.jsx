import { Link } from "react-router-dom";
import Headers from "./Headers.jsx";
import "../styles/About.css";

const AI_RESUME_URL = "https://vagas-nordestinas.vercel.app/dashboard";

export default function AiResume() {
  return (
    <>
      <Headers />
      <main className="about-page">
        <section className="about-container">
          <h1 className="about-title">AI Resume</h1>
          <p className="about-description">
            A ferramenta AI Resume está disponível no ambiente separado do
            projeto.
          </p>
          <div className="about-links">
            <a href={AI_RESUME_URL} target="_blank" rel="noopener noreferrer">
              Abrir AI Resume
            </a>
            <Link to="/profile">Voltar ao meu perfil</Link>
          </div>
        </section>
      </main>
    </>
  );
}
