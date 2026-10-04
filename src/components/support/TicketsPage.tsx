import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/support/TicketsPage.css";

const API_URL = (
  import.meta.env.VITE_TICKETS_API_URL ||
  "http://localhost:3001/api/tickets"
).replace(/\/$/, "");

type TicketStatus =
  | "in_analysis"
  | "waiting_for_user"
  | "resolved";

export interface Ticket {
  id: number | string;
  code: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_LABELS: Record<TicketStatus, string> = {
  in_analysis: "Em análise",
  waiting_for_user: "Aguardando resposta",
  resolved: "Resolvido",
};

const CATEGORY_LABELS: Record<string, string> = {
  ai_interview: "AI Interview",
  jobs: "Vagas",
  resume_comparison: "Comparação de currículo",
};

function normalizeStatus(value: unknown): string {
  const status = String(value ?? "");

  switch (status) {
    case "aberto":
    case "em_atendimento":
    case "analysis":
    case "in_analysis":
      return "in_analysis";

    case "awaiting_response":
    case "waiting_for_user":
      return "waiting_for_user";

    case "resolvido":
    case "resolved":
      return "resolved";

    default:
      return status;
  }
}

function normalizeTicket(value: unknown): Ticket {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error("A API retornou um chamado inválido.");
  }

  const row = value as Record<string, unknown>;

  if (typeof row.id !== "string" && typeof row.id !== "number") {
    throw new Error("A API retornou um chamado sem ID válido.");
  }

  const createdAt = String(
    row.createdAt ??
      row.created_at ??
      row.criado_em ??
      "",
  );

  const defaultCode =
    typeof row.id === "string"
      ? `#${row.id.slice(0, 8).toUpperCase()}`
      : `#${row.id}`;

  return {
    id: row.id,

    code: String(
      row.code ??
        row.protocolo ??
        row.ticket_number ??
        row.ticketNumber ??
        defaultCode,
    ),

    title: String(row.title ?? row.titulo ?? ""),
    description: String(row.description ?? row.descricao ?? ""),
    category: String(row.category ?? row.categoria ?? ""),
    status: normalizeStatus(row.status),

    createdAt,

    updatedAt: String(
      row.updatedAt ??
        row.updated_at ??
        row.atualizado_em ??
        createdAt,
    ),
  };
}

function formatDate(value: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "in_analysis":
    case "waiting_for_user":
    case "resolved":
      return STATUS_LABELS[status];

    default:
      return status || "—";
  }
}

function MyTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("");

  function abrirNovoChamado() {
    navigate("/relatar-problema");
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadTickets() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Erro na API: HTTP ${response.status}`);
        }

        const payload: unknown = await response.json();
        let rows: unknown = payload;

        if (
          payload !== null &&
          typeof payload === "object" &&
          !Array.isArray(payload)
        ) {
          const result = payload as Record<string, unknown>;
          rows = result.tickets ?? result.data;
        }

        if (!Array.isArray(rows)) {
          throw new Error(
            "A API precisa retornar um array ou { tickets: [...] }.",
          );
        }

        setTickets(rows.map(normalizeTicket));
      } catch (err: unknown) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os chamados.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTickets();

    return () => controller.abort();
  }, [reload]);

  const categories = Array.from(
    new Set(tickets.map((ticket) => ticket.category).filter(Boolean)),
  );

  const statuses = Array.from(
    new Set(tickets.map((ticket) => ticket.status).filter(Boolean)),
  );

  const searchText = search.trim().toLocaleLowerCase("pt-BR");

  const filteredTickets = tickets.filter((ticket) => {
    const text = [
      ticket.code,
      ticket.title,
      ticket.description,
    ]
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    if (!text.includes(searchText)) return false;
    if (category && ticket.category !== category) return false;
    if (status && ticket.status !== status) return false;

    if (period) {
      const now = new Date();
      const updatedAt = new Date(ticket.updatedAt).getTime();

      const cutoff =
        period === "today"
          ? new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            ).getTime()
          : now.getTime() - Number(period) * 86400000;

      if (
        !Number.isFinite(updatedAt) ||
        updatedAt < cutoff ||
        updatedAt > now.getTime()
      ) {
        return false;
      }
    }

    return true;
  });

  function countByStatus(value: TicketStatus): number {
    return tickets.filter((ticket) => ticket.status === value).length;
  }

  const summaries: {
    status: TicketStatus;
    label: string;
    icon: string;
    iconClass: string;
  }[] = [
    {
      status: "in_analysis",
      label: "em análise",
      icon: "◷",
      iconClass: "tickets-analysis-icon",
    },
    {
      status: "waiting_for_user",
      label: "aguardando resposta",
      icon: "◯",
      iconClass: "tickets-waiting-icon",
    },
    {
      status: "resolved",
      label: "resolvidos",
      icon: "✓",
      iconClass: "tickets-resolved-icon",
    },
  ];

  return (
    <div className="tickets-page">
      <header className="tickets-header">
        <a className="tickets-brand" href="/">
          Vagas Nordestinas
        </a>

        <nav
          className="tickets-navigation"
          aria-label="Navegação principal"
        >
          <a href="/">Vagas</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/curriculo">Meu currículo</a>

          <a
            className="active"
            href="/Tickets"
            aria-current="page"
          >
            Meus chamados
          </a>
        </nav>

        <div className="tickets-header-actions">
          <div className="tickets-avatar">TR</div>
          <span className="tickets-chevron" aria-hidden="true">
            ⌄
          </span>

          <button
            className="tickets-primary-button"
            type="button"
            onClick={abrirNovoChamado}
          >
            Relatar problema
          </button>
        </div>
      </header>

      <main className="tickets-content">
        <section className="tickets-title-section">
          <div className="tickets-title-row">
            <h1>Meus chamados</h1>
          </div>

          <p>
            Acompanhe os problemas relatados e as respostas da equipe.
          </p>
        </section>

        <section
          className="tickets-statistics"
          aria-label="Resumo dos chamados"
        >
          {summaries.map((item) => (
            <article
              className="tickets-stat-card"
              key={item.status}
            >
              <div
                className={`tickets-stat-icon ${item.iconClass}`}
                aria-hidden="true"
              >
                {item.icon}
              </div>

              <div>
                <strong>
                  {loading || error ? "—" : countByStatus(item.status)}
                </strong>
                <span>{item.label}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="tickets-filters" aria-label="Filtros">
          <div className="tickets-filter tickets-search-filter">
            <label htmlFor="ticket-search">Buscar chamados</label>

            <div className="tickets-input-wrapper">
              <span
                className="tickets-search-icon"
                aria-hidden="true"
              >
                ⌕
              </span>

              <input
                id="ticket-search"
                type="search"
                placeholder="Buscar por título, número ou descrição..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="tickets-filter">
            <label htmlFor="ticket-category">Categoria</label>

            <select
              id="ticket-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Todas as categorias</option>

              {categories.map((value) => (
                <option key={value} value={value}>
                  {CATEGORY_LABELS[value] ?? value}
                </option>
              ))}
            </select>
          </div>

          <div className="tickets-filter">
            <label htmlFor="ticket-status">Status</label>

            <select
              id="ticket-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Todos os status</option>

              {statuses.map((value) => (
                <option key={value} value={value}>
                  {getStatusLabel(value)}
                </option>
              ))}
            </select>
          </div>

          <div className="tickets-filter">
            <label htmlFor="ticket-period">Período</label>

            <select
              id="ticket-period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option value="">Todas as datas</option>
              <option value="today">Hoje</option>
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
            </select>
          </div>
        </section>

        <div className="tickets-results-bar">
          <span aria-live="polite">
            {loading
              ? "Carregando chamados..."
              : error
                ? "Falha ao carregar os chamados."
                : `${filteredTickets.length} chamado(s) encontrado(s)`}
          </span>

          <button
            className="tickets-primary-button"
            type="button"
            disabled={loading}
            onClick={() => setReload((value) => value + 1)}
          >
            Atualizar
          </button>
        </div>

        {error && (
          <p className="tickets-error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <section
            className="tickets-table-container"
            aria-label="Lista de chamados"
          >
            <table className="tickets-table">
              <thead>
                <tr>
                  <th scope="col">Chamado</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Status</th>
                  <th scope="col">Última atualização</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Nenhum chamado encontrado.</td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <strong>
                          {ticket.code} — {ticket.title}
                        </strong>

                        {ticket.description && (
                          <p className="tickets-description">
                            {ticket.description}
                          </p>
                        )}
                      </td>

                      <td>
                        {CATEGORY_LABELS[ticket.category] ??
                          (ticket.category || "—")}
                      </td>

                      <td>
                        <span
                          className={`tickets-status-badge tickets-status-${ticket.status}`}
                        >
                          {getStatusLabel(ticket.status)}
                        </span>
                      </td>

                      <td>{formatDate(ticket.updatedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        )}

        <section className="tickets-help-card">
          <div className="tickets-help-content">
            <div className="tickets-help-icon" aria-hidden="true">
              ?
            </div>

            <div>
              <h2>Precisa de ajuda?</h2>

              <p>
                Não encontrou o que precisa? Abra um novo chamado e
                nossa equipe vai ajudar.
              </p>
            </div>
          </div>

          <button
            className="tickets-primary-button tickets-new-button"
            type="button"
            onClick={abrirNovoChamado}
          >
            <span aria-hidden="true">＋</span>
            Abrir novo chamado
          </button>
        </section>
      </main>
    </div>
  );
}

export default MyTickets;