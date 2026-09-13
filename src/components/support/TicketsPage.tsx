import "../../styles/support/TicketsPage.css";

function MyTickets() {   
  return (
    <div className="tickets-page">
      <header className="tickets-header">
        <a className="tickets-brand" href="/">
          Vagas Nordestinas
        </a>

        <nav className="tickets-navigation">
          <a href="/">Vagas</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/curriculo">Meu currículo</a>
          <a className="active" href="/MyTickets">
            Meus chamados
          </a>
        </nav>

        <div className="tickets-header-actions">
          <div className="tickets-avatar">TR</div>
          <span className="tickets-chevron">⌄</span>

          <button className="tickets-primary-button" type="button">
            Relatar problema
          </button>
        </div>
      </header>

      <main className="tickets-content">
        <section className="tickets-title-section">
          <div className="tickets-title-row">
            <h1>Meus chamados</h1>
            <span className="tickets-visual-label">MODELO VISUAL</span>
          </div>

          <p>Acompanhe os problemas relatados e as respostas da equipe.</p>
        </section>

        <section className="tickets-statistics">
          <article className="tickets-stat-card">
            <div className="tickets-stat-icon tickets-analysis-icon">◷</div>

            <div>
              <strong>1</strong>
              <span>em análise</span>
            </div>
          </article>

          <article className="tickets-stat-card">
            <div className="tickets-stat-icon tickets-waiting-icon">◯</div>

            <div>
              <strong>1</strong>
              <span>aguardando resposta</span>
            </div>
          </article>

          <article className="tickets-stat-card">
            <div className="tickets-stat-icon tickets-resolved-icon">✓</div>

            <div>
              <strong>8</strong>
              <span>resolvidos</span>
            </div>
          </article>
        </section>

        <section className="tickets-filters">
          <div className="tickets-filter tickets-search-filter">
            <label htmlFor="ticket-search">Buscar chamados</label>

            <div className="tickets-input-wrapper">
              <span className="tickets-search-icon">⌕</span>

              <input
                id="ticket-search"
                type="text"
                placeholder="Buscar por título, número ou descrição..."
              />
            </div>
          </div>

          <div className="tickets-filter">
            <label htmlFor="ticket-category">Categoria</label>

            <select id="ticket-category">
              <option>Todas as categorias</option>
              <option>Vagas</option>
              <option>AI Interview</option>
              <option>Comparação de currículo</option>
            </select>
          </div>

          <div className="tickets-filter">
            <label htmlFor="ticket-status">Status</label>

            <select id="ticket-status">
              <option>Todos os status</option>
              <option>Em análise</option>
              <option>Aguardando resposta</option>
              <option>Resolvido</option>
            </select>
          </div>

          <div className="tickets-filter">
            <label htmlFor="ticket-period">Período</label>

            <select id="ticket-period">
              <option>Todas as datas</option>
              <option>Hoje</option>
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
            </select>
          </div>
        </section>

        <section className="tickets-table-container">
          <div className="tickets-table">
            <div className="tickets-table-header">
              <span>Chamado</span>
              <span>Categoria</span>
              <span>Status</span>
              <span>Última atualização</span>
              <span />
            </div>

            <article className="tickets-table-row">
              <div className="tickets-row-icon">○</div>

              <div className="tickets-description">
                <strong>#VN-051</strong>
                <span>Entrevista não reconheceu meu microfone</span>
              </div>

              <span className="tickets-category">AI Interview</span>

              <span className="tickets-status tickets-status-analysis">
                <span>◷</span>
                Em análise
              </span>

              <time>Atualizado hoje, 14:32</time>
              <span className="tickets-row-arrow">›</span>
            </article>

            <article className="tickets-table-row">
              <div className="tickets-row-icon">!</div>

              <div className="tickets-description">
                <strong>#VN-049</strong>
                <span>Currículo PDF não foi processado</span>
              </div>

              <span className="tickets-category">
                Comparação de currículo
              </span>

              <span className="tickets-status tickets-status-waiting">
                <span>!</span>
                Aguardando sua resposta
              </span>

              <time>Ontem, 18:10</time>
              <span className="tickets-row-arrow">›</span>
            </article>

            <article className="tickets-table-row">
              <div className="tickets-row-icon">●</div>

              <div className="tickets-description">
                <strong>#VN-042</strong>
                <span>Transcrição não foi salva</span>
              </div>

              <span className="tickets-category">AI Interview</span>

              <span className="tickets-status tickets-status-resolved">
                <span>✓</span>
                Resolvido
              </span>

              <time>12/09/2026</time>
              <span className="tickets-row-arrow">›</span>
            </article>

            <article className="tickets-table-row">
              <div className="tickets-row-icon">□</div>

              <div className="tickets-description">
                <strong>#VN-038</strong>
                <span>Vaga apareceu duplicada</span>
              </div>

              <span className="tickets-category">Vagas</span>

              <span className="tickets-status tickets-status-resolved">
                <span>✓</span>
                Resolvido
              </span>

              <time>08/09/2026</time>
              <span className="tickets-row-arrow">›</span>
            </article>
          </div>
        </section>

        <section className="tickets-help-card">
          <div className="tickets-help-content">
            <div className="tickets-help-icon">?</div>

            <div>
              <h2>Precisa de ajuda?</h2>

              <p>
                Não encontrou o que precisa? Abra um novo chamado e nossa
                equipe vai ajudar.
              </p>
            </div>
          </div>

          <button className="tickets-primary-button tickets-new-button">
            <span>＋</span>
            Abrir novo chamado
          </button>
        </section>
      </main>
    </div>
  );
}

export default MyTickets;