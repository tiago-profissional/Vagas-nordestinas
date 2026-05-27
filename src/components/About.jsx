import Headers from "./Headers.jsx";
import "../styles/About.css";

export default function About() {
  return (
    <>
      <Headers />

      <main className="about-page">
        <section className="about-container">
          <h1 className="about-title">Sobre o Vagas Nordestinas</h1>

          <p className="about-description">
            Vagas Nordestinas é uma plataforma de vagas de emprego desenvolvida
            como projeto de portfólio. O objetivo do projeto é simular um job
            board real, permitindo visualizar vagas, criar novas oportunidades,
            editar vagas existentes e navegar entre diferentes páginas com uma
            arquitetura moderna baseada em API REST.
          </p>

          <div className="about-grid">
            <div className="about-card">
              <h2>Stack</h2>
              <ul>
                <li>React</li>
                <li>React Router</li>
                <li>Vite</li>
                <li>PHP REST API</li>
                <li>MySQL</li>
                <li>CSS</li>
              </ul>
            </div>

            <div className="about-card">
              <h2>Features</h2>
              <ul>
                <li>Listagem de vagas</li>
                <li>Detalhes da vaga</li>
                <li>Criação de vagas</li>
                <li>Edição de vagas</li>
                <li>Exclusão de vagas</li>
                <li>Página 404 personalizada</li>
                <li>Consumo de API REST</li>
              </ul>
            </div>
          </div>

          <div className="about-extra">
            <div className="about-section">
              <h2>Objetivo do Projeto</h2>
              <p>
                Este projeto foi desenvolvido para demonstrar habilidades em
                desenvolvimento frontend utilizando React, manipulação de estado,
                arquitetura baseada em componentes e integração com APIs REST.
                A aplicação simula uma plataforma real de vagas de emprego.
              </p>
            </div>

            <div className="about-section">
              <h2>Arquitetura</h2>
              <p>
                O frontend foi construído em React utilizando Vite para build e
                React Router para navegação. A aplicação consome uma API REST
                construída em PHP que realiza operações de CRUD em um banco de
                dados MySQL para gerenciamento das vagas.
              </p>
            </div>

            <div className="about-section">
              <h2>Meu Papel</h2>
              <p>
                Fui responsável pelo desenvolvimento completo da aplicação,
                incluindo interface em React, estrutura de rotas, integração com
                API, gerenciamento de estado, tratamento de erros e organização
                da arquitetura do projeto.
              </p>
            </div>

            <div className="about-section">
              <h2>Project Highlights</h2>
              <ul className="about-highlights">
                <li>Arquitetura baseada em componentes</li>
                <li>Integração completa com API REST</li>
                <li>CRUD completo de vagas</li>
                <li>Roteamento dinâmico</li>
                <li>Tratamento de estados de erro e loading</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Links</h2>
              <div className="about-links">
                <a href="#" target="_blank" rel="noreferrer">
                  GitHub Repository
                </a>

                <a href="#" target="_blank" rel="noreferrer">
                  Live Demo
                </a>

                <a href="#" target="_blank" rel="noreferrer">
                  Video Walkthrough
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}