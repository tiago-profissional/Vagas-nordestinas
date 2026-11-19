import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import Footer from "./Footer.jsx";
import Headers from "./Headers.jsx";

import "../styles/AiResume.css";

const AI_API_URL = (import.meta.env.VITE_AI_API_URL || "/ai-api").replace(/\/+$/, "");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const EMPTY_FILTERS = {
  q: "",
  area: "",
  location: "",
  mode: "",
  seniority: "",
  contract: "",
};

async function readApiResponse(response) {
  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        response.ok
          ? "A API retornou uma resposta inválida."
          : `A API respondeu com erro ${response.status}.`,
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data.detalhe ||
        data.message ||
        data.error ||
        `Erro ${response.status} ao acessar a API.`,
    );
  }

  return data;
}

function getResumeText(cvData, apiResume) {
  const skills = cvData?.skills ?? apiResume?.skills ?? [];
  const experience = cvData?.experience ?? apiResume?.experience ?? "";
  const experienceText = Array.isArray(experience)
    ? experience
        .map((item) =>
          [item.title, item.company, item.period].filter(Boolean).join(" — "),
        )
        .filter(Boolean)
        .join("\n")
    : experience;

  return [Array.isArray(skills) ? skills.join(", ") : "", experienceText]
    .filter(Boolean)
    .join("\n");
}

function getErrorMessage(error, action) {
  if (error instanceof TypeError) {
    return `Não foi possível conectar à API de ${action}. Verifique se o serviço está disponível, se VITE_AI_API_URL está configurada ou se o proxy /ai-api está ativo.`;
  }

  return error instanceof Error ? error.message : `Erro ao ${action}.`;
}

function formatJobLocation(job) {
  return [job.city, job.state].filter(Boolean).join(", ") || "Local não informado";
}

export default function AiResume() {
  const location = useLocation();
  const inputRef = useRef(null);
  const isCompare = location.pathname.replace(/\/+$/, "") === "/ai-resume/compare";

  const [selectedFile, setSelectedFile] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadNotice, setUploadNotice] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [areas, setAreas] = useState([]);
  const [apiResume, setApiResume] = useState(null);
  const [metadataError, setMetadataError] = useState("");
  const [rankedJobs, setRankedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [compareError, setCompareError] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [explanation, setExplanation] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState("");

  const resumeText = useMemo(
    () => getResumeText(cvData, apiResume),
    [cvData, apiResume],
  );
  const resumeSkills = cvData?.skills ?? apiResume?.skills ?? [];
  const resumeExperience =
    cvData?.totalExperience ?? apiResume?.experience ?? "Não informado";
  const resumeLocation =
    cvData?.location ?? apiResume?.location ?? "Não informado";

  useEffect(() => {
    if (!isCompare) return undefined;

    const controller = new AbortController();
    setMetadataError("");

    async function loadMetadata() {
      try {
        const data = await readApiResponse(
          await fetch(`${AI_API_URL}/api/areas`, { signal: controller.signal }),
        );
        setAreas(Array.isArray(data.areas) ? data.areas : []);
      } catch (error) {
        if (!controller.signal.aborted) {
          setMetadataError(getErrorMessage(error, "carregar áreas profissionais"));
        }
      }

      if (cvData) return;

      try {
        const data = await readApiResponse(
          await fetch(`${AI_API_URL}/api/resume`, { signal: controller.signal }),
        );
        setApiResume(data.resume ?? null);
      } catch (error) {
        if (!controller.signal.aborted) {
          setMetadataError((current) =>
            current || getErrorMessage(error, "carregar o currículo salvo"),
          );
        }
      }
    }

    void loadMetadata();
    return () => controller.abort();
  }, [isCompare, cvData]);

  useEffect(() => {
    if (!isCompare) return undefined;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSelectedJobId("");
      setExplanation(null);
      setExplanationError("");

      if (!resumeText.trim()) {
        setRankedJobs([]);
        setCompareError("Envie um currículo para encontrar vagas compatíveis.");
        setLoadingJobs(false);
        return;
      }

      setLoadingJobs(true);
      setCompareError("");

      try {
        const data = await readApiResponse(
          await fetch(`${AI_API_URL}/ai/match/top5`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              resume_text: resumeText,
              ...filters,
            }),
          }),
        );
        setRankedJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (error) {
        if (!controller.signal.aborted) {
          setRankedJobs([]);
          setCompareError(getErrorMessage(error, "buscar vagas compatíveis"));
        }
      } finally {
        if (!controller.signal.aborted) setLoadingJobs(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [filters, isCompare, resumeText]);

  function selectFile(file) {
    setUploadError("");
    setUploadNotice("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf") ||
        (file.type && file.type !== "application/pdf")) {
      setSelectedFile(null);
      setUploadError("Selecione um arquivo PDF válido.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setUploadError("O arquivo deve ter no máximo 5 MB.");
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload(event) {
    event.preventDefault();
    if (!selectedFile || uploading) return;

    setUploading(true);
    setUploadError("");
    setUploadNotice("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const data = await readApiResponse(
        await fetch(`${AI_API_URL}/api/upload-cv`, {
          method: "POST",
          body: formData,
        }),
      );

      if (!data.cvData || typeof data.cvData !== "object") {
        throw new Error("A API não retornou os dados da análise do currículo.");
      }

      setCvData(data.cvData);
      setApiResume({
        skills: Array.isArray(data.cvData.skills) ? data.cvData.skills : [],
        experience: data.cvData.totalExperience || "",
        location: data.cvData.location || "",
      });
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setUploadNotice(
        data.saved === false
          ? "Análise concluída. Não foi possível salvar o currículo no serviço; a análise permanece disponível nesta tela."
          : "Análise concluída com sucesso.",
      );
    } catch (error) {
      setUploadError(getErrorMessage(error, "analisar o currículo"));
    } finally {
      setUploading(false);
    }
  }

  async function selectJob(jobId) {
    setSelectedJobId(jobId);
    setExplanation(null);
    setExplanationError("");
    setExplanationLoading(true);

    try {
      const data = await readApiResponse(
        await fetch(
          `${AI_API_URL}/ai/match/${encodeURIComponent(jobId)}/explain`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resume_text: resumeText }),
          },
        ),
      );
      setExplanation(data);
    } catch (error) {
      setExplanationError(
        getErrorMessage(error, "carregar as evidências de compatibilidade"),
      );
    } finally {
      setExplanationLoading(false);
    }
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="vn-ai-resume page-wrapper">
      <Headers />
      <main className="vn-ai-resume__main">
        <div className="vn-ai-resume__container">
          <div className="vn-ai-resume__topline">
            <div>
              <p className="vn-ai-resume__eyebrow">Vagas Nordestinas</p>
              <h1>Currículo com IA</h1>
              <p className="vn-ai-resume__description">
                Analise seu currículo e descubra oportunidades alinhadas à sua experiência.
              </p>
            </div>
            <Link className="vn-ai-resume__button vn-ai-resume__button--secondary" to="/">
              Voltar para vagas
            </Link>
          </div>

          <nav className="vn-ai-resume__tabs" aria-label="Ferramentas de currículo">
            <Link
              to="/ai-resume"
              className={`vn-ai-resume__tab ${!isCompare ? "is-active" : ""}`}
              aria-current={!isCompare ? "page" : undefined}
            >
              Analisar currículo
            </Link>
            <Link
              to="/ai-resume/compare"
              className={`vn-ai-resume__tab ${isCompare ? "is-active" : ""}`}
              aria-current={isCompare ? "page" : undefined}
            >
              Comparar vagas
            </Link>
          </nav>

          {isCompare ? (
            <section className="vn-ai-resume__section" aria-labelledby="compare-title">
              <header className="vn-ai-resume__section-heading">
                <h2 id="compare-title">Comparar currículo com vaga</h2>
                <p>Encontre as oportunidades mais compatíveis com seu perfil.</p>
              </header>

              <section className="vn-ai-resume__card vn-ai-resume__summary">
                <div>
                  <h3>Seu currículo atual</h3>
                  <p>
                    {resumeSkills.length}{" "}
                    {resumeSkills.length === 1 ? "habilidade detectada" : "habilidades detectadas"}
                    {" · "}Experiência: {resumeExperience}
                    {" · "}Localização: {resumeLocation}
                  </p>
                </div>
                <Link to="/ai-resume" className="vn-ai-resume__text-link">
                  Analisar outro currículo
                </Link>
              </section>

              <section className="vn-ai-resume__card" aria-labelledby="filters-title">
                <div className="vn-ai-resume__card-heading">
                  <h3 id="filters-title">Filtros</h3>
                  <button
                    className="vn-ai-resume__text-link"
                    type="button"
                    onClick={() => setFilters(EMPTY_FILTERS)}
                  >
                    Limpar filtros
                  </button>
                </div>
                <div className="vn-ai-resume__filters">
                  <label className="vn-ai-resume__field vn-ai-resume__field--wide">
                    Cargo ou palavra-chave
                    <input
                      type="search"
                      value={filters.q}
                      placeholder="Ex.: React, back-end, dados..."
                      onChange={(event) => updateFilter("q", event.target.value)}
                    />
                  </label>
                  <label className="vn-ai-resume__field">
                    Área profissional
                    <select value={filters.area} onChange={(event) => updateFilter("area", event.target.value)}>
                      <option value="">Todas</option>
                      {areas.map((area) => <option key={area} value={area}>{area}</option>)}
                    </select>
                  </label>
                  <label className="vn-ai-resume__field">
                    Localização
                    <input
                      value={filters.location}
                      placeholder="Cidade ou estado"
                      onChange={(event) => updateFilter("location", event.target.value)}
                    />
                  </label>
                  <label className="vn-ai-resume__field">
                    Modalidade
                    <select value={filters.mode} onChange={(event) => updateFilter("mode", event.target.value)}>
                      <option value="">Todas</option>
                      <option value="remoto">Remoto</option>
                      <option value="hibrido">Híbrido</option>
                      <option value="presencial">Presencial</option>
                      <option value="nao_informado">Não informado</option>
                    </select>
                  </label>
                  <label className="vn-ai-resume__field">
                    Nível
                    <select value={filters.seniority} onChange={(event) => updateFilter("seniority", event.target.value)}>
                      <option value="">Todos</option>
                      <option value="junior">Júnior</option>
                      <option value="pleno">Pleno</option>
                      <option value="senior">Sênior</option>
                      <option value="nao_informado">Não informado</option>
                    </select>
                  </label>
                  <label className="vn-ai-resume__field">
                    Tipo de contrato
                    <select value={filters.contract} onChange={(event) => updateFilter("contract", event.target.value)}>
                      <option value="">Todos</option>
                      <option value="clt">CLT</option>
                      <option value="pj">PJ</option>
                      <option value="estagio">Estágio</option>
                      <option value="nao_informado">Não informado</option>
                    </select>
                  </label>
                </div>
              </section>

              {metadataError && <p className="vn-ai-resume__alert" role="alert">{metadataError}</p>}
              {compareError && <p className="vn-ai-resume__alert" role="alert">{compareError}</p>}
              {loadingJobs && <p className="vn-ai-resume__status" role="status">Buscando vagas compatíveis...</p>}

              {!loadingJobs && !compareError && (
                <section className="vn-ai-resume__card" aria-live="polite">
                  <h3>Vagas recomendadas ({rankedJobs.length})</h3>
                  {rankedJobs.length === 0 ? (
                    <p className="vn-ai-resume__muted">Nenhuma vaga encontrada com esses filtros.</p>
                  ) : (
                    <div className="vn-ai-resume__jobs">
                      {rankedJobs.map(({ job, score = 0, matched = [], missing = [] }) => (
                        <article className="vn-ai-resume__job" key={job.id}>
                          <h4>{job.title}</h4>
                          <p className="vn-ai-resume__job-company">{job.company}</p>
                          <div className="vn-ai-resume__score-row">
                            <span>Compatibilidade</span><strong>{score}%</strong>
                          </div>
                          <progress value={score} max="100" aria-label={`Compatibilidade de ${score}%`} />
                          <p className="vn-ai-resume__muted">
                            {formatJobLocation(job)} · {job.mode || "Modalidade não informada"} · {job.seniority || "Nível não informado"}
                          </p>
                          {job.description && <p>{job.description}</p>}
                          {(matched.length > 0 || missing.length > 0) && (
                            <div className="vn-ai-resume__chips" aria-label="Habilidades">
                              {matched.map((skill) => <span className="is-matched" key={`matched-${skill}`}>{skill}</span>)}
                              {missing.map((skill) => <span key={`missing-${skill}`}>{skill}</span>)}
                            </div>
                          )}
                          <button
                            type="button"
                            className="vn-ai-resume__button vn-ai-resume__button--primary"
                            onClick={() => void selectJob(job.id)}
                          >
                            Analisar compatibilidade
                          </button>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {selectedJobId && (
                <section className="vn-ai-resume__card" aria-live="polite">
                  <h3>Evidências da compatibilidade</h3>
                  {explanationLoading && <p>Carregando explicação...</p>}
                  {explanationError && <p className="vn-ai-resume__alert" role="alert">{explanationError}</p>}
                  {explanation && (
                    <>
                      <p>Score baseado em evidências: {explanation.score}%</p>
                      {(explanation.matched_skills || []).map((evidence) => (
                        <article className="vn-ai-resume__evidence" key={evidence.skill}>
                          <h4>{evidence.skill}</h4>
                          <p>Currículo ({evidence.resume_source}): “{evidence.resume_excerpt}”</p>
                          <p>Vaga ({evidence.job_source}): “{evidence.job_excerpt}”</p>
                        </article>
                      ))}
                      {explanation.missing_gaps?.length > 0 && (
                        <div>
                          <h4>Não encontrado no texto informado</h4>
                          <ul>{explanation.missing_gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul>
                          <p className="vn-ai-resume__muted">Isso não significa que você não saiba essas habilidades.</p>
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}
            </section>
          ) : (
            <section className="vn-ai-resume__section" aria-labelledby="analysis-title">
              <div className="vn-ai-resume__analysis-grid">
                <section className="vn-ai-resume__card vn-ai-resume__upload-card">
                  <h2 id="analysis-title">Analisar currículo</h2>
                  <p>Envie seu currículo em PDF para extrair informações e receber recomendações personalizadas.</p>
                  <form onSubmit={handleUpload}>
                    <label
                      className={`vn-ai-resume__dropzone ${isDragging ? "is-dragging" : ""}`}
                      htmlFor="resume-pdf"
                      onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(event) => {
                        event.preventDefault();
                        setIsDragging(false);
                        selectFile(event.dataTransfer.files?.[0] ?? null);
                      }}
                    >
                      <span className="vn-ai-resume__upload-icon" aria-hidden="true">↑</span>
                      <strong>{selectedFile ? selectedFile.name : "Escolha ou arraste seu currículo"}</strong>
                      <span>Somente PDF · até 5 MB</span>
                      <input
                        ref={inputRef}
                        id="resume-pdf"
                        type="file"
                        accept="application/pdf"
                        onChange={(event) => {
                          selectFile(event.target.files?.[0] ?? null);
                          event.target.value = "";
                        }}
                      />
                    </label>
                    {uploadError && <p className="vn-ai-resume__alert" role="alert">{uploadError}</p>}
                    {uploadNotice && <p className="vn-ai-resume__success" role="status">{uploadNotice}</p>}
                    <button
                      className="vn-ai-resume__button vn-ai-resume__button--primary"
                      type="submit"
                      disabled={!selectedFile || uploading}
                    >
                      {uploading ? "Analisando..." : "Enviar e analisar currículo"}
                    </button>
                  </form>
                  <p className="vn-ai-resume__muted">
                    A análise usa o serviço configurado. Se ele não estiver acessível, confira a conexão, CORS e a configuração de VITE_AI_API_URL ou do proxy /ai-api.
                  </p>
                </section>

                <section className="vn-ai-resume__card vn-ai-resume__score-card">
                  <span className="vn-ai-resume__score-label">Score do currículo</span>
                  {cvData ? (
                    <>
                      <strong className="vn-ai-resume__score">{Number(cvData.score) || 0}<small>/100</small></strong>
                      <p>{cvData.name && cvData.name !== "Não informado" ? `Análise pronta para ${cvData.name}.` : "Sua análise está pronta."}</p>
                    </>
                  ) : (
                    <p className="vn-ai-resume__muted">Envie seu currículo para ver seu score e áreas de melhoria.</p>
                  )}
                </section>
              </div>

              {cvData && (
                <>
                  <section className="vn-ai-resume__card">
                    <h2>Informações extraídas</h2>
                    <dl className="vn-ai-resume__info-grid">
                      <div><dt>Nome</dt><dd>{cvData.name || "Não informado"}</dd></div>
                      <div><dt>E-mail</dt><dd>{cvData.email || "Não informado"}</dd></div>
                      <div><dt>Telefone</dt><dd>{cvData.phone || "Não informado"}</dd></div>
                      <div><dt>Localização</dt><dd>{cvData.location || "Não informado"}</dd></div>
                      <div><dt>Experiência total</dt><dd>{cvData.totalExperience || "Não informado"}</dd></div>
                    </dl>
                  </section>

                  <div className="vn-ai-resume__results-grid">
                    <section className="vn-ai-resume__card">
                      <h2>Habilidades detectadas</h2>
                      {cvData.skills?.length ? (
                        <div className="vn-ai-resume__chips">
                          {cvData.skills.map((skill) => <span className="is-matched" key={skill}>{skill}</span>)}
                        </div>
                      ) : <p className="vn-ai-resume__muted">Nenhuma habilidade foi identificada.</p>}
                    </section>
                    <section className="vn-ai-resume__card">
                      <h2>Experiência profissional</h2>
                      {cvData.experience?.length ? (
                        <div className="vn-ai-resume__experience-list">
                          {cvData.experience.map((item, index) => (
                            <article key={`${item.title}-${item.company}-${index}`}>
                              <h3>{item.title || "Cargo não informado"}</h3>
                              <p>{item.company || "Empresa não informada"}</p>
                              <span>{item.period || "Período não informado"}</span>
                            </article>
                          ))}
                        </div>
                      ) : <p className="vn-ai-resume__muted">Nenhuma experiência foi identificada.</p>}
                    </section>
                  </div>

                  <section className="vn-ai-resume__card">
                    <h2>Análise da IA</h2>
                    {cvData.aiAnalysis?.length ? (
                      <ul className="vn-ai-resume__tips">
                        {cvData.aiAnalysis.map((tip, index) => (
                          <li key={`${tip.text}-${index}`} className={tip.status === "success" ? "is-success" : "is-warning"}>
                            <span aria-hidden="true">{tip.status === "success" ? "✓" : "!"}</span>
                            {tip.text}
                          </li>
                        ))}
                      </ul>
                    ) : <p className="vn-ai-resume__muted">A API não retornou recomendações para este currículo.</p>}
                    <Link className="vn-ai-resume__button vn-ai-resume__button--primary" to="/ai-resume/compare">
                      Ver vagas compatíveis
                    </Link>
                  </section>
                </>
              )}
            </section>
          )}
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
