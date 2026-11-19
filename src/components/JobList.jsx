import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

// Gera os itens da paginação compacta: números e "..."
// Ex.: [1, "...", 4, 5, 6, "...", 36]
function getPageItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "end-ellipsis", total];
  }

  if (current >= total - 2) {
    return [1, "start-ellipsis", total - 3, total - 2, total - 1, total];
  }

  return [
    1,
    "start-ellipsis",
    current - 1,
    current,
    current + 1,
    "end-ellipsis",
    total,
  ];
}

function JobList({ jobs, selectedJobId, onSelect, noSearchResults }) {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const jobsArray = Array.isArray(jobs) ? jobs : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [jobs]);

  const totalPages = Math.ceil(jobsArray.length / jobsPerPage);

  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;

    return jobsArray.slice(startIndex, endIndex);
  }, [jobsArray, currentPage]);

  if (jobsArray.length === 0) {
    return (
      <div className="job-list-not-found">
        <h3>{noSearchResults ? "Vaga não encontrada" : "Nenhuma vaga encontrada"}</h3>

        <p>
          {noSearchResults
            ? "Tente pesquisar por outro cargo, empresa, cidade ou estado."
            : "Ainda não existem vagas cadastradas."}
        </p>
      </div>
    );
  }

  function getSalary(job) {
    if (job.salary) return job.salary;

    if (job.salary_min && job.salary_max) {
      return `R$ ${job.salary_min} - R$ ${job.salary_max}`;
    }

    if (job.minSalary && job.maxSalary) {
      return `R$ ${job.minSalary} - R$ ${job.maxSalary}`;
    }

    if (job.salary_min) {
      return `A partir de R$ ${job.salary_min}`;
    }

    if (job.minSalary) {
      return `A partir de R$ ${job.minSalary}`;
    }

    return "Salário a combinar";
  }

  function getWorkMode(job) {
    const mode = job.work_mode || job.modality || "";
    const normalizedMode = mode.toLowerCase();

    if (normalizedMode === "remote" || normalizedMode === "remoto") {
      return "Remoto";
    }

    if (normalizedMode === "hybrid" || normalizedMode === "híbrido") {
      return "Híbrido";
    }

    return "Presencial";
  }

  function getEmploymentType(job) {
    const type = job.employment_type || job.contractType || job.type || "";

    if (type === "full_time" || type === "Full-time") {
      return "Tempo Integral";
    }

    if (type === "part_time" || type === "Part-time") {
      return "Meio Período";
    }

    if (type === "Internship" || type === "internship") {
      return "Estágio";
    }

    return type || "PJ";
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <>
      <div className="job-list-wrapper">
        {currentJobs.map((job) => (
          <Link
            key={job.id}
            to={`/jobs/${job.id}`}
            className={`job ${
              String(selectedJobId) === String(job.id) ? "selected" : ""
            }`}
            onClick={() => onSelect(job)}
            aria-label={`Ver detalhes da vaga ${job.title} na empresa ${job.company}`}
          >
            <div className="job-top">
              <span className="job-source">{job.company}</span>
            </div>

            <h3 className="job-title">{job.title}</h3>

            <p className="job-location">
              {job.location ||
                `${job.city || ""}${job.state ? `, ${job.state}` : ""}`}
            </p>

            <p className="job-salary">{getSalary(job)}</p>

            <div className="job-tags">
              <span className="tag">{getWorkMode(job)}</span>
              <span className="tag fulltime">{getEmploymentType(job)}</span>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="job-pagination">
          <button
            type="button"
            className="job-pagination__btn"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Prev
          </button>

          {getPageItems(currentPage, totalPages).map((item) => {
            if (typeof item === "string") {
              return (
                <span key={item} className="job-pagination__ellipsis">
                  …
                </span>
              );
            }

            return (
              <button
                key={item}
                type="button"
                className={
                  currentPage === item
                    ? "job-pagination__btn job-pagination__btn--active"
                    : "job-pagination__btn"
                }
                onClick={() => goToPage(item)}
              >
                {item}
              </button>
            );
          })}

          <button
            type="button"
            className="job-pagination__btn"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default JobList;