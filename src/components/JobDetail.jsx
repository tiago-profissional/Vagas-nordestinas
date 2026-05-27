// src/components/JobDetail.jsx
import "../styles/JobDetail.css";

function JobDetail({ job, loading, error, notFound }) {
  // Estados de loading/erro/vazio
  if (loading) {
    return <div className="jd-loading">🔍 Carregando vaga...</div>;
  }

  if (error) {
    return <div className="jd-error">⚠️ Erro: {error}</div>;
  }

  if (notFound || !job) {
    return <div className="jd-empty">✨ Selecione uma vaga para ver os detalhes</div>;
  }

  // Formatação do salário
  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `R$ ${Number(job.salary_min).toLocaleString()} - R$ ${Number(job.salary_max).toLocaleString()}`;
    }
    if (job.salary_min) {
      return `A partir de R$ ${Number(job.salary_min).toLocaleString()}`;
    }
    return "Salário a combinar";
  };

  // Formatação do tipo de trabalho
  const getWorkModeText = (mode) => {
    switch (mode) {
      case "remote": return "Home Office";
      case "hybrid": return "Híbrido";
      case "onsite": return "Presencial";
      default: return mode || "Não definido";
    }
  };

  // Formatação do tipo de contrato
  const getEmploymentTypeText = (type) => {
    switch (type) {
      case "full_time": return "Tempo integral";
      case "part_time": return "Meio período";
      case "pj": return "PJ";
      default: return type || "Não definido";
    }
  };

  // Benefícios (pode vir do backend depois)
  const benefits = [
    "Vale Refeição",
    "Vale Transporte",
    "Plano de Saúde",
    "Plano Odontológico",
    "Seguro de Vida",
    "Gympass"
  ];

  return (
    <div className="jd-container">
      {/* Header com logo e título */}
      <div className="jd-header">
        <div className="jd-header-left">
          <div className="jd-company-logo">
            {job.company?.charAt(0) || "C"}
          </div>
          <div className="jd-title-section">
            <h1 className="jd-title">{job.title}</h1>
            <div className="jd-company-info">
              <span className="jd-company-name">{job.company}</span>
              <span className="jd-rating">4.4 ★</span>
              <span className="jd-reviews">(1.2k avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="jd-tags">
        <span className="jd-tag">📍 {job.city}, {job.state}</span>
        <span className="jd-tag">💰 {formatSalary()}</span>
        <span className="jd-tag">🏢 {getWorkModeText(job.work_mode)}</span>
        <span className="jd-tag">⏰ {getEmploymentTypeText(job.employment_type)}</span>
      </div>

      {/* Dados da vaga */}
      <div className="jd-section">
        <h3 className="jd-section-title">📋 Dados da vaga</h3>
        <div className="jd-grid">
          <div className="jd-grid-item">
            <span className="jd-grid-label">Tipo de vaga</span>
            <span className="jd-grid-value">{getEmploymentTypeText(job.employment_type)}</span>
          </div>
          <div className="jd-grid-item">
            <span className="jd-grid-label">Modalidade</span>
            <span className="jd-grid-value">{getWorkModeText(job.work_mode)}</span>
          </div>
          <div className="jd-grid-item">
            <span className="jd-grid-label">Localização</span>
            <span className="jd-grid-value">{job.city}, {job.state}</span>
          </div>
          <div className="jd-grid-item">
            <span className="jd-grid-label">Faixa salarial</span>
            <span className="jd-grid-value">{formatSalary()}</span>
          </div>
        </div>
      </div>

      {/* Descrição */}
      <div className="jd-section">
        <h3 className="jd-section-title">📝 Descrição da vaga</h3>
        <p className="jd-description">
          {job.description || "Nenhuma descrição fornecida para esta vaga."}
        </p>
      </div>

      {/* Benefícios */}
      <div className="jd-section">
        <h3 className="jd-section-title">✨ Benefícios</h3>
        <div className="jd-benefits">
          {benefits.map((benefit, index) => (
            <span key={index} className="jd-benefit-badge">
              {benefit}
            </span>
          ))}
        </div>
      </div>

      {/* Botão */}
      <button className="jd-apply-btn">
        📝 Candidatar-se agora
      </button>
    </div>
  );
}

export default JobDetail;