import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/TermsConsentModal.css";

const CONSENT_KEY = "vagas_nordestinas_terms_accepted";

export default function TermsConsentModal() {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const alreadyAccepted = localStorage.getItem(CONSENT_KEY);

    if (alreadyAccepted !== "true") {
      setOpen(true);
    }
  }, []);

  function handleAccept() {
    if (!accepted) {
      return;
    }

    localStorage.setItem(CONSENT_KEY, "true");
    setOpen(false);
  }

  function handleExit() {
    setOpen(false);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="consent-overlay">
      <div
        className="consent-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
      >
        <div className="consent-main-icon">
          <span>✓</span>
        </div>

        <h1 id="consent-title">
          Antes de continuar
        </h1>

        <p className="consent-subtitle">
          Queremos que você saiba como o Vagas Nordestinas funciona
          e como utilizamos seus dados.
        </p>

        <div className="consent-features">
          <div className="consent-feature">
            <div className="consent-feature-icon">
              👥
            </div>

            <div>
              <h2>Uso responsável</h2>

              <p>
                Utilize a plataforma de forma ética e mantenha seus
                dados atualizados.
              </p>
            </div>
          </div>

          <div className="consent-feature">
            <div className="consent-feature-icon">
              🔒
            </div>

            <div>
              <h2>Privacidade</h2>

              <p>
                Seus dados são tratados conforme nossa Política de
                Privacidade.
              </p>
            </div>
          </div>

          <div className="consent-feature">
            <div className="consent-feature-icon consent-ai-icon">
              AI
            </div>

            <div>
              <h2>Recursos de IA</h2>

              <p>
                As análises e recomendações auxiliam suas decisões,
                mas não garantem contratação.
              </p>
            </div>
          </div>
        </div>

        <div className="consent-notice">
          <div className="consent-notice-icon">
            !
          </div>

          <span>
            Leia os documentos antes de aceitar.
          </span>
        </div>

        <div className="consent-links">
          <Link to="/termos-de-uso">
            Termos de Uso
          </Link>

          <Link to="/politica-de-privacidade">
            Política de Privacidade
          </Link>
        </div>

        <label className="consent-checkbox">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) =>
              setAccepted(event.target.checked)
            }
          />

          <span>
            Li e concordo com os Termos de Uso e com a Política
            de Privacidade.
          </span>
        </label>

        <div className="consent-actions">
          <button
            type="button"
            className="consent-btn consent-btn-exit"
            onClick={handleExit}
          >
            Sair
          </button>

          <button
            type="button"
            className="consent-btn consent-btn-accept"
            onClick={handleAccept}
            disabled={!accepted}
          >
            Aceitar e continuar
          </button>
        </div>

        <p className="consent-footer-text">
          Você poderá consultar estes documentos novamente nas
          configurações da conta.
        </p>
      </div>
    </div>
  );
}