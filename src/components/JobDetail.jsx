import applyIcon from "../img/raio.png";
import "../styles/JobDetail.css";

function JobDetail({
  job,
  loading,
  error,
  notFound,
  noSearchResults,
}) {
  if (loading) {
    return <div className="jd-loading">🔍 Carregando vaga...</div>;
  }

  if (error) {
    return <div className="jd-error">⚠️ Erro: {error}</div>;
  }

  if (noSearchResults) {
    return (
      <div className="jd-empty">
        <h2>Vaga não encontrada</h2>

        <p>
          Tente pesquisar por outro cargo, empresa, cidade ou estado.
        </p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="jd-empty">
        <h2>Vaga não encontrada</h2>

        <p>Essa vaga não existe ou não está mais disponível.</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="jd-empty">
        ✨ Selecione uma vaga para ver os detalhes
      </div>
    );
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function formatCurrency(value) {
    const number = Number(value);

    if (!Number.isFinite(number) || number <= 0) {
      return null;
    }

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
  }

  function extractSalaryFromDescription(description) {
    if (!description) {
      return null;
    }

    const text = String(description);

    const rangeMatch = text.match(
      /R\$\s*([\d.]+)\s*(?:a|até|[-–—])\s*R?\$?\s*([\d.]+)/i
    );

    if (rangeMatch) {
      const minimum = rangeMatch[1].replace(/\./g, "");
      const maximum = rangeMatch[2].replace(/\./g, "");

      const formattedMinimum = formatCurrency(minimum);
      const formattedMaximum = formatCurrency(maximum);

      if (formattedMinimum && formattedMaximum) {
        return `${formattedMinimum} - ${formattedMaximum}`;
      }
    }

    const singleMatch = text.match(/R\$\s*([\d.]+)/i);

    if (singleMatch) {
      const salary = singleMatch[1].replace(/\./g, "");

      return formatCurrency(salary);
    }

    return null;
  }

  function formatSalary() {
    const minimum = formatCurrency(job.salary_min);
    const maximum = formatCurrency(job.salary_max);

    if (minimum && maximum) {
      return `${minimum} - ${maximum}`;
    }

    if (minimum) {
      return `A partir de ${minimum}`;
    }

    if (maximum) {
      return `Até ${maximum}`;
    }

    return (
      extractSalaryFromDescription(job.description) ||
      "Salário a combinar"
    );
  }

  function getWorkModeText(mode) {
    const normalizedMode = normalizeText(mode);

    switch (normalizedMode) {
      case "remote":
      case "remoto":
        return "Remoto";

      case "hybrid":
      case "hibrido":
      case "híbrido":
        return "Híbrido";

      case "onsite":
      case "on-site":
      case "presencial":
        return "Presencial";

      default:
        return mode || "Não informado";
    }
  }

  function getEmploymentTypeText(type) {
    const normalizedType = normalizeText(type);

    switch (normalizedType) {
      case "full_time":
      case "full-time":
      case "tempo integral":
        return "Tempo integral";

      case "part_time":
      case "part-time":
      case "meio período":
      case "meio periodo":
        return "Meio período";

      case "internship":
      case "estágio":
      case "estagio":
        return "Estágio";

      case "pj":
        return "PJ";

      case "clt":
        return "CLT";

      default:
        return type || "Não informado";
    }
  }

  function getLocation() {
    const city = String(job.city || "").trim();
    const state = String(job.state || "").trim();

    if (city && state) {
      return `${city}, ${state}`;
    }

    if (city) {
      return city;
    }

    if (state) {
      return state;
    }

    const workMode = getWorkModeText(
      job.work_mode || job.work_model || job.modality
    );

    if (workMode === "Remoto") {
      return "Remoto";
    }

    return "Não informada";
  }

  function getSkills() {
    if (Array.isArray(job.skills)) {
      return job.skills.filter(Boolean);
    }

    if (typeof job.skills === "string") {
      try {
        const parsedSkills = JSON.parse(job.skills);

        return Array.isArray(parsedSkills)
          ? parsedSkills.filter(Boolean)
          : [];
      } catch {
        return job.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }
    }

    return [];
  }

  function cleanDescription(description) {
    if (!description) {
      return "Nenhuma descrição fornecida para esta vaga.";
    }

    return String(description)
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      .replace(/^\s*[-*]\s+/gm, "• ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function formatDate(value) {
    if (!value) {
      return "Não informada";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Não informada";
    }

    return date.toLocaleDateString("pt-BR");
  }

  function handleApply() {
    if (!job.url) {
      return;
    }

    window.open(job.url, "_blank", "noopener,noreferrer");
  }

  const skills = getSkills();

  const workMode = getWorkModeText(
    job.work_mode || job.work_model || job.modality
  );

  const employmentType = getEmploymentTypeText(
    job.employment_type || job.contractType || job.type
  );

  const company =
    job.company ||
    job.posted_by ||
    "Empresa não informada";

  return (
    <div className="jd-container">
      <div className="jd-header">
        <div className="jd-header-left">
          <div className="jd-company-logo">
            {company.charAt(0).toUpperCase()}
          </div>

          <div className="jd-title-section">
            <h1 className="jd-title">
              {job.title || "Título não informado"}
            </h1>

            <div className="jd-company-info">
              <span className="jd-company-name">
                {company}
              </span>

              {job.seniority && (
                <span className="jd-rating">
                  {job.seniority}
                </span>
              )}

              {job.source && (
                <span className="jd-reviews">
                  Fonte: {job.source}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="jd-tags">
        <span className="jd-tag">
          📍 {getLocation()}
        </span>

        <span className="jd-tag">
          💰 {formatSalary()}
        </span>

        <span className="jd-tag">
          🏢 {workMode}
        </span>

        <span className="jd-tag">
          ⏰ {employmentType}
        </span>
      </div>

      <div className="jd-section">
        <h3 className="jd-section-title">
          📋 Dados da vaga
        </h3>

        <div className="jd-grid">
          <div className="jd-grid-item">
            <span className="jd-grid-label">
              Tipo de vaga
            </span>

            <span className="jd-grid-value">
              {employmentType}
            </span>
          </div>

          <div className="jd-grid-item">
            <span className="jd-grid-label">
              Modalidade
            </span>

            <span className="jd-grid-value">
              {workMode}
            </span>
          </div>

          <div className="jd-grid-item">
            <span className="jd-grid-label">
              Localização
            </span>

            <span className="jd-grid-value">
              {getLocation()}
            </span>
          </div>

          <div className="jd-grid-item">
            <span className="jd-grid-label">
              Faixa salarial
            </span>

            <span className="jd-grid-value">
              {formatSalary()}
            </span>
          </div>

          {job.seniority && (
            <div className="jd-grid-item">
              <span className="jd-grid-label">
                Senioridade
              </span>

              <span className="jd-grid-value">
                {job.seniority}
              </span>
            </div>
          )}

          {job.posted_at && (
            <div className="jd-grid-item">
              <span className="jd-grid-label">
                Publicada em
              </span>

              <span className="jd-grid-value">
                {formatDate(job.posted_at)}
              </span>
            </div>
          )}
        </div>
      </div>

      {skills.length > 0 && (
        <div className="jd-section">
          <h3 className="jd-section-title">
            🛠️ Tecnologias e habilidades
          </h3>

          <div className="jd-benefits">
            {skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="jd-benefit-badge"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="jd-section">
        <h3 className="jd-section-title">
          📝 Descrição da vaga
        </h3>

        <div className="jd-description">
          {cleanDescription(job.description)}
        </div>
      </div>

      {job.url && (
        <button
          type="button"
          className="jd-apply-btn"
          onClick={handleApply}
          aria-label={`Candidatar-se à vaga ${
            job.title || ""
          }`}
        >
          <img
            src={applyIcon}
            alt=""
            aria-hidden="true"
            className="jd-apply-icon"
          />

          <span>Candidatar-se</span>
        </button>
      )}
    </div>
  );
}

export default JobDetail;