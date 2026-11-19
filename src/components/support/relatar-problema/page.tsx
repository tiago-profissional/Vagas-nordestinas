import { useRef, useState } from "react";
import type { FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import {
  ChevronDown,
  FileText,
  MessageCircle,
  Settings,
  LoaderCircle,
} from "lucide-react";

import Footer from "../../Footer.jsx";
import Headers from "../../Headers.jsx";
import { useCurrentUser } from "../../../hooks/useCurrentUser.js";
import "../../../styles/support/relatar-problema/support_ticket.css";

const API_URL = (
  import.meta.env.VITE_TICKETS_API_URL ||
  "http://localhost:3001/api/tickets"
).replace(/\/$/, "");

const categorias = [
  "AI Interview",
  "Currículo",
  "Vagas e candidaturas",
  "Conta e acesso",
  "Outro",
];

export default function RelatarProblemaPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const tituloRef = useRef<HTMLInputElement>(null);

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("AI Interview");
  const [descricao, setDescricao] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function voltarParaSuporte() {
    navigate(isAdmin ? "/tickets" : "/");
  }

  function focarFormulario() {
    tituloRef.current?.focus();
  }

  async function enviarChamado(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (enviando) return;

    setErro("");
    setSucesso(false);

    const tituloLimpo = titulo.trim();
    const descricaoLimpa = descricao.trim();

    if (tituloLimpo.length < 5 || tituloLimpo.length > 160) {
      setErro("O título deve ter entre 5 e 160 caracteres.");
      return;
    }

    if (
      descricaoLimpa.length < 20 ||
      descricaoLimpa.length > 5000
    ) {
      setErro(
        "A descrição deve ter entre 20 e 5.000 caracteres.",
      );
      return;
    }

    if (!categorias.includes(categoria)) {
      setErro("Selecione uma categoria válida.");
      return;
    }

    setEnviando(true);

    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: tituloLimpo,
          category: categoria,
          description: descricaoLimpa,
        }),
      });

      const dados = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        const mensagem =
          typeof dados?.message === "string"
            ? dados.message
            : `Não foi possível enviar o chamado. HTTP ${resposta.status}.`;

        throw new Error(mensagem);
      }

      if (isAdmin) {
        navigate("/tickets");
      } else {
        setTitulo("");
        setDescricao("");
        setSucesso(true);
      }
    } catch (error: unknown) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar à API. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="vn-page">
      <Headers />

      <main className="vn-main">
        <nav
          className="vn-breadcrumb"
          aria-label="Você está em"
        >
          <button
            type="button"
            onClick={voltarParaSuporte}
            disabled={enviando}
          >
            {isAdmin ? "Meus chamados" : "Vagas"}
          </button>

          <span aria-hidden="true">/</span>
          <span aria-current="page">Relatar problema</span>
        </nav>

        <div className="vn-heading">
          <h1>Relatar problema</h1>

          <p>
            Descreva o que aconteceu para que nossa equipe
            possa ajudar.
          </p>
        </div>

        {erro && (
          <div
            className="vn-feedback vn-error"
            role="alert"
          >
            {erro}
          </div>
        )}

        {sucesso && (
          <div
            className="vn-feedback vn-success"
            role="status"
          >
            Chamado enviado. A equipe de suporte recebeu seu relato.
          </div>
        )}

        <div className="vn-grid">
          <form
            className="vn-card vn-form"
            onSubmit={enviarChamado}
            aria-busy={enviando}
          >
            <fieldset disabled={enviando}>
              <div className="vn-field">
                <label htmlFor="titulo">
                  Título do problema
                </label>

                <input
                  ref={tituloRef}
                  id="titulo"
                  name="titulo"
                  type="text"
                  value={titulo}
                  onChange={(event) =>
                    {
                      setSucesso(false);
                      setTitulo(event.target.value);
                    }
                  }
                  placeholder="Microfone não reconhecido na entrevista"
                  minLength={5}
                  maxLength={160}
                  required
                />
              </div>

              <div className="vn-field">
                <label htmlFor="categoria">
                  Categoria
                </label>

                <div className="vn-select-wrapper">
                  <select
                    id="categoria"
                    name="categoria"
                    value={categoria}
                    onChange={(event) =>
                      {
                        setSucesso(false);
                        setCategoria(event.target.value);
                      }
                    }
                    required
                  >
                    {categorias.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="vn-field">
                <label htmlFor="descricao">
                  Descrição do problema
                </label>

                <textarea
                  id="descricao"
                  name="descricao"
                  value={descricao}
                  onChange={(event) =>
                    {
                      setSucesso(false);
                      setDescricao(event.target.value);
                    }
                  }
                  placeholder="Ao iniciar a entrevista, o sistema não reconheceu meu microfone. Autorizei o acesso no navegador e tentei novamente, mas o problema continuou."
                  minLength={20}
                  maxLength={5000}
                  aria-describedby="descricao-ajuda"
                  required
                />

                <p
                  id="descricao-ajuda"
                  className="vn-field-help"
                >
                  Conte o que você tentou fazer, o que
                  aconteceu e como repetir o problema.
                </p>
              </div>

              <div className="vn-form-actions">
                <button
                  type="button"
                  className="vn-button vn-secondary"
                  onClick={voltarParaSuporte}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="vn-button vn-primary"
                >
                  {enviando && (
                    <LoaderCircle
                      className="vn-spin"
                      size={18}
                      aria-hidden="true"
                    />
                  )}

                  {enviando
                    ? "Enviando..."
                    : "Enviar chamado"}
                </button>
              </div>
            </fieldset>
          </form>

          <aside className="vn-card vn-help">
            <div className="vn-help-icon">
              <MessageCircle
                size={40}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <h2>Como podemos ajudar?</h2>

            <p className="vn-help-intro">
              Explique o problema com o máximo de detalhes.
            </p>

            <ul className="vn-help-list">
              <li>
                <span>
                  <FileText
                    size={22}
                    aria-hidden="true"
                  />
                </span>

                O que você estava tentando fazer?
              </li>

              <li>
                <span>
                  <MessageCircle
                    size={22}
                    aria-hidden="true"
                  />
                </span>

                Qual mensagem apareceu?
              </li>

              <li>
                <span>
                  <Settings
                    size={22}
                    aria-hidden="true"
                  />
                </span>

                O que você já tentou?
              </li>
            </ul>

            <div className="vn-help-footer">
              <h3>Depois do envio</h3>

              <p>
                {isAdmin
                  ? "Acompanhe o status em Meus chamados."
                  : "A equipe de suporte receberá seu relato."}
              </p>

              <button
                type="button"
                className="vn-text-link"
                onClick={voltarParaSuporte}
                disabled={enviando}
              >
                {isAdmin ? "Ver meus chamados" : "Voltar às vagas"}
              </button>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}