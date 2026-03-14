import { useNavigate } from "react-router-dom";
import Headers from "./Headers.jsx";
import "../styles/NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Headers />

      <main className="notfound-page">
        <div className="notfound-box">
          <h1 className="notfound-code">404</h1>
          <h2 className="notfound-title">Página não encontrada</h2>
          <p className="notfound-text">
            A página que você está procurando não existe ou foi removida
          </p>

          <button
            className="notfound-button"
            onClick={() => navigate("/")}
          >
            Voltar para as Vagas
          </button>
        </div>
      </main>
    </>
  );
}