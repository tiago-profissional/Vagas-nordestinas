import { useEffect, useMemo, useState } from "react";
import "../styles/Home.css";

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
          <div
            key={job.id}
            className={`job ${
              String(selectedJobId) === String(job.id) ? "selected" : ""
            }`}
            onClick={() => onSelect(job)}
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
          </div>
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

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                type="button"
                className={
                  currentPage === page
                    ? "job-pagination__btn job-pagination__btn--active"
                    : "job-pagination__btn"
                }
                onClick={() => goToPage(page)}
              >
                {page}
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